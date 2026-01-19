import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import PaymentModal from '@/components/PaymentModal';
import { Download } from 'lucide-react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center, onMapReady }) {
    const map = useMap();
    useEffect(() => {
        if (onMapReady) {
            onMapReady(map);
        }
    }, [map, onMapReady]);

    useEffect(() => {
        if (center) {
            map.flyTo(center, 19);
        }
    }, [center, map]);
    return null;
}



export default function Dashboard() {
    const { user, updateBalance, logout } = useAuth();
    const { toast } = useToast();

    const [url, setUrl] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [area, setArea] = useState('');
    const [loading, setLoading] = useState(false);

    // Custom Polygon State
    const [customPoints, setCustomPoints] = useState(null);
    const [calculatedArea, setCalculatedArea] = useState(null);
    const featureGroupRef = useRef();
    const mapContainerRef = useRef();

    // Helper: Calculate Polygon Area using Shoelace Formula (returns m²)
    const calculatePolygonArea = (points) => {
        if (!points || points.length < 3) return 0;

        // Convert lng/lat to approximate meters (simple projection)
        const toMeters = (lng, lat, refLat) => {
            const x = lng * 111320 * Math.cos(refLat * Math.PI / 180);
            const y = lat * 110540;
            return { x, y };
        };

        const refLat = points[0][1]; // Use first point's lat as reference
        const meterPoints = points.map(p => toMeters(p[0], p[1], refLat));

        // Shoelace formula
        let area = 0;
        const n = meterPoints.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += meterPoints[i].x * meterPoints[j].y;
            area -= meterPoints[j].x * meterPoints[i].y;
        }
        return Math.abs(area / 2);
    };

    const parseUrl = (input) => {
        setUrl(input);
        // Regex for Google Maps: @-6.123,106.123
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = input.match(regex);
        if (match) {
            setLat(match[1]);
            setLng(match[2]);
            toast({ title: "Coordinates Found", description: `${match[1]}, ${match[2]}` });
        }
    };

    const handleCreated = (e) => {
        const layer = e.layer;
        // Ensure only one polygon exists
        if (featureGroupRef.current) {
            const layers = featureGroupRef.current.getLayers();
            layers.forEach(l => {
                if (l !== layer) featureGroupRef.current.removeLayer(l);
            });
        }

        // Set polygon style to red with thick stroke
        layer.setStyle({
            color: '#FF0000',
            weight: 4,
            opacity: 1,
            fillColor: '#FF0000',
            fillOpacity: 0.1
        });

        const latlngs = layer.getLatLngs()[0]; // Outer ring
        const points = latlngs.map(ll => [ll.lng, ll.lat]);
        setCustomPoints(points);

        // Calculate and display area
        const areaM2 = calculatePolygonArea(points);
        setCalculatedArea(areaM2);
    };

    const handleEdited = (e) => {
        const layers = e.layers;
        layers.eachLayer(layer => {
            // Maintain red style after edit
            layer.setStyle({
                color: '#FF0000',
                weight: 4,
                opacity: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.1
            });

            const latlngs = layer.getLatLngs()[0];
            const points = latlngs.map(ll => [ll.lng, ll.lat]);
            setCustomPoints(points);

            // Recalculate area after edit
            const areaM2 = calculatePolygonArea(points);
            setCalculatedArea(areaM2);
        });
    };

    const handleDeleted = (e) => {
        setCustomPoints(null);
        setCalculatedArea(null);
    };

    // Helper: Sync Inputs to Editable Map Layer
    useEffect(() => {
        // If we are already in custom drawing mode (customPoints set), DO NOT overwrite.
        if (customPoints) return;

        // Only draw if inputs are valid
        if (!lat || !lng || !area) return;

        const sideMeters = Math.sqrt(parseFloat(area));
        const halfSide = sideMeters / 2;
        const cLat = parseFloat(lat);
        const cLng = parseFloat(lng);
        const dLat = halfSide / 111320;
        const dLng = halfSide / (111320 * Math.cos(cLat * Math.PI / 180));

        const minX = cLng - dLng;
        const maxX = cLng + dLng;
        const minY = cLat - dLat;
        const maxY = cLat + dLat;

        // Create Polygon Points (TL, TR, BR, BL)
        const points = [
            [maxY, minX],
            [maxY, maxX],
            [minY, maxX],
            [minY, minX]
        ];

        if (featureGroupRef.current) {
            featureGroupRef.current.clearLayers();
            // detailed: allow intersection: false
            const poly = L.polygon(points, { color: "#3b82f6", weight: 2 });
            poly.addTo(featureGroupRef.current);
            // IMPORTANT: We do NOT setCustomPoints here. 
            // We want it to remain "Input Mode" until user *edits* it.

            // However, to make it editable, it just needs to be in the FeatureGroup.
            // When user clicks 'Edit' in toolbar, Leaflet Draw picks up all layers in FeatureGroup.
        }

    }, [lat, lng, area, customPoints]);

    const handleGenerate = async () => {
        // If no custom points, try to grab from current featureGroup (in case user edited but didn't trigger event? No, onEdited should trigger)
        // Actually, if customPoints is null, we used to generate square from inputs.
        // But now, the inputs generate a visual square in featureGroup.
        // If user DOES NOT edit, customPoints is null.
        // So we should fallback to inputs logic.

        let payloadPoints = customPoints;

        // Safety: If customPoints is null but we have layers in featureGroup (e.g. from inputs), 
        // maybe we should use them? 
        // But the input logic in backend is robust for squares.
        // Let's stick to: customPoints ? use it : use lat/lng/area

        if (!payloadPoints && (!lat || !lng || !area)) {
            toast({ title: "Error", description: "Please draw a polygon OR fill coordinates + area", variant: "destructive" });
            return;
        }
        if (user.token_balance < 5) {
            toast({ title: "Insufficient Tokens", description: "Please contact admin to top up.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const payload = customPoints ? { customPoints } : {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                area: parseFloat(area)
            };

            const response = await api.post('/generator/create', payload, { responseType: 'blob' });

            // Trigger Download
            const blob = new Blob([response.data], { type: 'application/zip' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `polygon_${Date.now()}.zip`;
            link.click();

            // Update local balance
            updateBalance(user.token_balance - 5);
            toast({ title: "Success", description: "Shapefile generated!" });

            // Cleanup drawn polygon if desired, or keep it. keeping it is better UX.

        } catch (error) {
            toast({ title: "Error", description: "Generation failed", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const mapCenter = (lat && lng) ? [parseFloat(lat), parseFloat(lng)] : [-6.2088, 106.8456]; // Default Jakarta

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b bg-card px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="font-bold text-xl flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary"></div>
                    LineSima
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-sm font-medium bg-secondary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2">
                        <span className="hidden sm:inline">Balance:</span>
                        <span className="text-primary font-bold">{user?.token_balance} <span className="hidden sm:inline">Tokens</span></span>
                    </div>
                    <PaymentModal>
                        <Button size="sm" className="px-2 sm:px-4">{/* Desktop: Get Tokens, Mobile: + */}
                            <span className="hidden sm:inline">Get Tokens</span>
                            <span className="sm:hidden text-lg leading-none">+</span>
                        </Button>
                    </PaymentModal>
                    <Button variant="ghost" size="sm" onClick={logout} className="px-2 sm:px-4">
                        <span className="hidden sm:inline">Logout</span>
                        <span className="sm:hidden">Log</span>
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Panel */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Generator Tool</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
                            <strong>New:</strong> Use the drawing tools on the map to create custom shapes!
                        </div>

                        <div className="space-y-2">
                            <Label>Google Maps Link</Label>
                            <Input
                                placeholder="Paste link here..."
                                value={url}
                                onChange={(e) => parseUrl(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Auto-extracts Lat/Long from URL</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Latitude</Label>
                                <Input value={lat} onChange={(e) => setLat(e.target.value)} disabled={!!customPoints} />
                            </div>
                            <div className="space-y-2">
                                <Label>Longitude</Label>
                                <Input value={lng} onChange={(e) => setLng(e.target.value)} disabled={!!customPoints} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Area (m²)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 10000"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                disabled={!!customPoints}
                            />
                            {customPoints && calculatedArea && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-xs text-green-700 font-medium mb-1">✓ Polygon Custom Aktif</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-bold text-green-800">
                                                {calculatedArea.toLocaleString('id-ID', { maximumFractionDigits: 0 })} m²
                                            </p>
                                            <p className="text-xs text-green-600">
                                                ≈ {(calculatedArea / 10000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Hektar
                                            </p>
                                        </div>
                                        <div className="text-2xl">📐</div>
                                    </div>
                                </div>
                            )}
                            {customPoints && !calculatedArea && <p className="text-xs text-green-600 font-medium">Using Custom Drawn Polygon</p>}
                        </div>

                        <Button className="w-full" size="lg" onClick={handleGenerate} disabled={loading}>
                            <Download className="w-4 h-4 mr-2" />
                            {loading ? "Processing..." : "Generate ZIP (-5 Tokens)"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Map Preview */}
                <Card ref={mapContainerRef} className="lg:col-span-2 overflow-hidden h-[400px] sm:h-[500px] lg:h-auto relative min-h-[400px]">
                    <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.google.com/intl/en-US_US/help/terms_maps.html">Google</a>'
                            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                            maxZoom={22}
                        />
                        <FeatureGroup ref={featureGroupRef}>
                            <EditControl
                                position='topleft'
                                onCreated={handleCreated}
                                onEdited={handleEdited}
                                onDeleted={handleDeleted}
                                draw={{
                                    rectangle: true,
                                    polygon: true,
                                    circle: false,
                                    circlemarker: false,
                                    marker: false,
                                    polyline: false,
                                }}
                            />
                        </FeatureGroup>
                        <MapUpdater center={mapCenter} />
                    </MapContainer>

                    {/* Instructions Panel - Bottom Left (hidden on export) */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white p-3 rounded-lg shadow-lg z-[1000] max-w-xs hide-on-export">
                        <p className="font-bold text-sm mb-1">🗺️ Petunjuk Menggambar:</p>
                        <ul className="text-xs space-y-1 text-slate-300">
                            <li>• Klik ikon <strong>Polygon</strong> atau <strong>Kotak</strong> di kiri atas</li>
                            <li>• Klik di peta untuk menambah titik sudut</li>
                            <li>• Klik titik pertama untuk menutup area</li>
                            <li>• Gunakan ikon <strong>Pensil</strong> untuk edit bentuk</li>
                        </ul>
                    </div>

                    {/* Status Badge - Top Right (hidden on export) */}
                    {customPoints && (
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1.5 rounded-full shadow-lg z-[1000] text-xs font-bold flex items-center gap-1 hide-on-export">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Polygon Custom Aktif
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}
