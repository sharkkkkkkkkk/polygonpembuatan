import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

export default function PaymentPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* Navbar */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="font-bold text-xl flex items-center gap-2">
                        <img src="/assets/logo.svg" alt="Logo" className="w-8 h-8" />
                        <span>LineSima</span>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" asChild>
                            <a href="/">Kembali ke Beranda</a>
                        </Button>
                    </div>
                </div>
            </nav>

            <section className="py-20">
                <div className="container px-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-12 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-bl-full">
                            {/* <img src="/src/assets/qris.jpg" className="w-48 h-48 opacity-50 mix-blend-overlay" alt="QRIS" /> */}
                        </div>

                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-bold mb-6">Cara Pembayaran & Akses Akun</h2>
                            <p className="text-slate-300 text-lg mb-8">
                                Ikuti langkah-langkah mudah berikut untuk melakukan top up token atau mengaktifkan akun Anda.
                            </p>

                            <div className="space-y-8">
                                <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/10">
                                    <h3 className="text-2xl font-semibold mb-4 text-green-400">1. Transfer via QRIS</h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="bg-white p-4 rounded-lg inline-block w-fit">
                                            {/* Placeholder QRIS - User will replace this */}
                                            <img src={`/assets/qrispay.jpg?v=${new Date().getTime()}`} className="w-80 h-auto object-contain" alt="Scan QRIS Disini" />
                                        </div>
                                        <div className="space-y-2 text-slate-300 flex-1">
                                            <p>Scan kode QRIS di samping menggunakan aplikasi e-wallet atau mobile banking favorit Anda (GoPay, OVO, Dana, ShopeePay, BCA Mobile, dll).</p>
                                            <div className="py-2">
                                                <div className="text-sm text-slate-400">Harga Paket:</div>
                                                <div className="text-2xl font-bold text-white">Rp 50.000 / 15 Token</div>
                                            </div>
                                            <p className="text-sm italic text-slate-400">*Harga dapat berubah sewaktu-waktu.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/10">
                                    <h3 className="text-2xl font-semibold mb-4 text-blue-400">2. Konfirmasi Pembayaran</h3>
                                    <p className="text-slate-300 mb-4">
                                        Setelah berhasil melakukan pembayaran, silakan kirimkan bukti transfer (screenshot) ke WhatsApp Admin kami agar token segera ditambahkan ke akun Anda.
                                    </p>
                                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2" asChild>
                                        <a href="https://wa.me/6288983840979?text=Halo%20Admin,%20saya%20sudah%20transfer%20untuk%20top%20up%20token.%20Mohon%20diproses." target="_blank" rel="noreferrer">
                                            Konfirmasi via WhatsApp
                                        </a>
                                    </Button>
                                    {/* <p className="mt-4 text-sm text-slate-400">
                                        Sertakan email yang terdaftar saat mengirim bukti transfer.
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
