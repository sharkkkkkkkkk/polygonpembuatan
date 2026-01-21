import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PaymentModal from '@/components/PaymentModal';
import Footer from '@/components/Footer';
import { CheckCircle2, Map, Zap, Shield, Loader2, Coins, Menu, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { KABUPATEN_JAWA } from '@/data/locations';
import { Badge } from '@/components/ui/badge';
import {
    MONEY_KEYWORDS,
    TECHNICAL_KEYWORDS,
    PROFESSIONAL_KEYWORDS,
    LONG_TAIL_KEYWORDS,
    generateSchemaMarkup
} from '@/data/seo_keywords';
// import blogPosts from '@/data/blog_posts'; // Remove static import
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Landing() {
    const { login, register, user } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [posts, setPosts] = useState([]); // State for dynamic posts

    useEffect(() => {
        // Fetch posts from Supabase
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .limit(6);

            if (data) setPosts(data);
        };
        fetchPosts();
    }, []);

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser) {
                if (loggedInUser.role === 'admin') {
                    window.location.href = '/kelola';
                } else {
                    window.location.href = '/dashboard';
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
            <Helmet>
                <title>Buat Polygon NIB OSS & Peta Tanah Online | SHP Generator Gratis - LineSima</title>
                <meta name="description" content="Gagal upload peta di OSS? Buat file Polygon (.shp) untuk NIB dan Izin Lokasi (KKPR) secara instan. Cukup tempel Link Google Maps, langsung jadi file ZIP Shapefile siap upload. Coba gratis sekarang!" />
                <meta name="keywords" content={[
                    ...MONEY_KEYWORDS.map(k => k.keyword),
                    ...TECHNICAL_KEYWORDS.map(k => k.keyword),
                    ...PROFESSIONAL_KEYWORDS.map(k => k.keyword),
                    ...LONG_TAIL_KEYWORDS.map(k => k.keyword),
                    ...KABUPATEN_JAWA.map(k => `jasa pembuatan polygon ${k.toLowerCase()}`)
                ].join(', ')} />
                <link rel="canonical" href="https://pembuatanpolygon.site/" />

                {/* JSON-LD Schema Markup */}
                <script type="application/ld+json">
                    {JSON.stringify(generateSchemaMarkup("Pembuatan Polygon OSS", "Indonesia"))}
                </script>
            </Helmet>

            {/* Navbar */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="font-bold text-xl flex items-center gap-2">
                        <img src="/assets/logo.svg" alt="Logo" className="w-8 h-8" />
                        <span>LineSima</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-4">
                        <Button variant="outline" asChild className="mr-2">
                            <a href="/payment">Cara Pembayaran</a>
                        </Button>
                        {user ? (
                            <Button asChild>
                                <a href="/dashboard">Dashboard</a>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => setIsLogin(true)}>Masuk</Button>
                                <Button onClick={() => setIsLogin(false)}>Mulai Sekarang</Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden border-t p-4 bg-background absolute w-full shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-5">
                        <Button variant="outline" asChild className="w-full justify-start">
                            <a href="/payment">Cara Pembayaran</a>
                        </Button>
                        {user ? (
                            <Button asChild className="w-full">
                                <a href="/dashboard">Dashboard</a>
                            </Button>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="ghost" onClick={() => { setIsLogin(true); setIsMenuOpen(false); }}>Masuk</Button>
                                    <Button onClick={() => { setIsLogin(false); setIsMenuOpen(false); }}>Mulai Sekarang</Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500 blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-500 blur-[100px]" />
                </div>

                <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center px-4">
                    <div className="space-y-6">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            Pembuatan POLYGON
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
                            Pembuatan <br />
                            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">POLYGON NIB OSS</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg">
                            Gagal upload peta di OSS? Buat file Polygon (.shp) untuk NIB dan Izin Lokasi (KKPR) secara instan.
                            Cukup tempel Link Google Maps, langsung jadi file ZIP siap upload.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="xl" className="h-12 px-8 text-lg w-full sm:w-auto" onClick={() => {
                                if (user) {
                                    window.location.href = '/dashboard';
                                } else {
                                    document.getElementById('auth-card').scrollIntoView({ behavior: 'smooth' });
                                    setIsLogin(false);
                                }
                            }}>
                                Mulai Generate
                            </Button>
                            <Button variant="outline" size="xl" className="h-12 px-8 text-lg w-full sm:w-auto" asChild>
                                <a href="https://www.youtube.com/watch?v=3DpbXQSG0fY" target="_blank" rel="noopener noreferrer">
                                    Dokumentasi
                                </a>
                            </Button>
                        </div>

                        <div className="pt-8 flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Standar ESRI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Akurasi Tinggi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Unduh Instan</span>
                            </div>
                        </div>
                    </div>

                    {/* Auth Card or Welcome Message if Logged In */}
                    <div className="flex justify-center lg:justify-end" id="auth-card">
                        {user ? (
                            <Card className="w-full max-w-md border-muted/40 shadow-2xl bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Selamat Datang!</CardTitle>
                                    <CardDescription>
                                        Anda masuk sebagai {user.email}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Saldo Token</p>
                                        <p className="text-3xl font-bold">{user.token_balance} Token</p>
                                    </div>
                                    <Button className="w-full h-12 text-lg" asChild>
                                        <a href="/dashboard">Buka Dashboard</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="w-full max-w-md border-muted/40 shadow-2xl bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Masuk ke Akun</CardTitle>
                                    <CardDescription>
                                        Silakan masuk untuk melanjutkan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Input
                                                type="email"
                                                placeholder="nama@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                                className="bg-background/50"
                                            />
                                            <Input
                                                type="password"
                                                placeholder="Sandi"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sedang Masuk...
                                                </>
                                            ) : (
                                                "Masuk"
                                            )}
                                        </Button>
                                    </form>
                                    <div className="mt-8 text-center p-6 bg-white border-2 border-red-500 rounded-xl shadow-xl">
                                        <p className="text-xl font-black text-black mb-2 uppercase tracking-wide">
                                            Belum punya akun?
                                        </p>
                                        <p className="text-lg font-extrabold text-red-600 mb-6 animate-pulse">
                                            WAJIB MELAKUKAN AKTIVASI AKUN TERLEBIH DAHULU!
                                        </p>
                                        <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl h-14 shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all" asChild>
                                            <a href="/payment">AKTIVASI AKUN DISINI</a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Cara Kerja Sistem</h2>
                        <p className="text-muted-foreground">
                            Kami menyederhanakan proses pembuatan polygon GIS yang rumit menjadi 3 langkah mudah.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                                <Map className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">1. Input Data</h3>
                            <p className="text-muted-foreground">
                                Tempel link Google Maps atau masukkan koordinat Lat/Long secara manual. Tentukan luas area dalam m².
                            </p>
                        </div>
                        <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">2. Proses Otomatis</h3>
                            <p className="text-muted-foreground">
                                Mesin kami menghitung geometri presisi dan menyusun data binary Shapefile secara real-time.
                            </p>
                        </div>
                        <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">3. Unduh Hasil</h3>
                            <p className="text-muted-foreground">
                                Terima file ZIP berisi .shp, .shx, .dbf, dan .prj yang siap digunakan di software GIS (ArcGIS/QGIS).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / Payment Info */}
            <section className="py-20">
                <div className="container px-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-12 overflow-hidden relative shadow-2xl">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-16 bg-blue-500/10 rounded-bl-[100px]"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Sistem Token Fleksibel & Hemat</h2>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    Tidak ada biaya tersembunyi atau langganan bulanan yang mengikat. Anda memiliki kendali penuh atas pengeluaran Anda. Cukup isi ulang saldo token saat Anda membutuhkannya.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold" asChild>
                                        <a href="/payment">Lihat Cara Pembayaran</a>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-blue-500/20 rounded-lg">
                                            <Coins className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400">Biaya per Generate</div>
                                            <div className="text-2xl font-bold">5 Token <span className="text-sm font-normal text-slate-400">/ request</span></div>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Dapatkan hasil shapefile presisi tinggi hanya dengan 5 token per kali generate. Efisien dan terjangkau.
                                    </p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        Cara Top Up Mudah
                                    </h4>
                                    <ul className="space-y-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                                            <span>Buka halaman <a href="/payment" className="text-blue-400 hover:underline">Cara Pembayaran</a>.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                                            <span>Scan QRIS dan transfer sesuai nominal yang diinginkan.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">3</span>
                                            <span>Konfirmasi ke Admin WhatsApp & token langsung masuk!</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Articles / Blog Section */}
            <section className="py-20 bg-background">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <Badge className="mb-4">Blog & Tutorial</Badge>
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Panduan OSS & GIS Terbaru</h2>
                        <p className="text-muted-foreground">
                            Artikel pilihan untuk membantu Anda memahami teknis pembuatan peta polygon dan perizinan OSS.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Link key={post.id} to={`/blog/${post.slug}`} className="group block h-full">
                                    <article className="bg-muted/30 border rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-2">
                                                <BookOpen className="w-3 h-3" />
                                                Tutorial
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t">
                                                <span>{post.author || 'Admin'}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                Belum ada artikel terbaru.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* SEO Locations Section */}
            <section className="py-12 bg-muted/20 border-t">
                <div className="container px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Jangkauan Layanan Kami</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs text-muted-foreground">
                        {KABUPATEN_JAWA.map((kab, index) => (
                            <div key={index} className="hover:text-primary transition-colors cursor-default">
                                Jasa Pembuatan Polygon {kab}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
