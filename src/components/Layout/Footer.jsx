import React from 'react';
    import { Link } from 'react-router-dom';
    import { Instagram, PhoneCall, MapPin, Mail } from 'lucide-react';

    const Footer = () => (
      <footer style={{ backgroundColor: '#554c4f' }} className="text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center md:text-right">
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Ms Madi', cursive", color: '#f0d9e7' }}>
              زهرة
            </h3>
            <p className="text-2xl mb-1">  للعطور الراقية اسم له تاريخ </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">روابط مهمة</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-[#f0d9e7] transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-[#f0d9e7] transition-colors">جميع المنتجات</Link></li>
              <li><Link to="/about" className="hover:text-[#f0d9e7] transition-colors">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-[#f0d9e7] transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start">
                <PhoneCall size={18} className="ml-2 rtl:mr-2 text-[#f0d9e7]" />
                <a href="tel:+96876396934" className="hover:text-[#f0d9e7]">76396934</a>
              </li>
              <p className="text-sm flex items-center justify-center md:justify-start">
              <MapPin size={16} className="ml-1 rtl:mr-1 text-[#f0d9e7]" />
              سلطنة عُمان
            </p>
            </ul>
            <div className="flex justify-center md:justify-start space-x-4 rtl:space-x-reverse mt-6">
              <a href="https://www.instagram.com/zhrt_alatw" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={28} />
              </a>
              <a href="https://wa.me/96876347266?text=" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-10 border-t border-white/20">
          <p className="text-sm text-white/70">&copy; {new Date().getFullYear()} زهرة للعطور. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    );

    export default Footer;