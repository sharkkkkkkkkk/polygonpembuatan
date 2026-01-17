import { Component } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <img src="/assets/logo.svg" alt="Logo" className="w-8 h-8" />
                            <span>LineSima</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Precision GIS Polygon Generation.
                            Automate your land plotting with high-accuracy shapefiles.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Features</a></li>
                            <li><a href="#" className="hover:text-primary">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">About Us</a></li>
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Ecosystem</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="https://main-webapp.com" className="hover:text-primary flex items-center gap-1">
                                    Main WebApp
                                    <Component className="w-3 h-3" />
                                </a>
                            </li>
                            <li><a href="#" className="hover:text-primary">Documentation</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} LineSima Systems. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
