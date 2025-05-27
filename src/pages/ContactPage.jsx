import React from 'react';
    import { motion } from 'framer-motion';
    import { MapPin, PhoneCall, Mail, Instagram } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';

    const ContactPage = () => {
      const { toast } = useToast();
      const handleSubmit = (e) => {
        e.preventDefault();
        toast({
          title: "تم إرسال رسالتك بنجاح!",
          description: "سنتواصل معك في أقرب وقت ممكن.",
        });
        e.target.reset();
      };

      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-12 rounded-xl shadow-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: '#8f436a' }}>تواصل معنا</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#554c4f' }}>معلومات الاتصال</h2>
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-lg text-gray-700">
                  <MapPin size={24} className="text-[#a65b86]" aria-hidden="true" />
                  <span>سلطنة عُمان</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-lg text-gray-700">
                  <PhoneCall size={24} className="text-[#a65b86]" aria-hidden="true" />
                  <a href="tel:+96876396934" className="hover:text-[#a65b86]">76396934</a>
                </div>
                <h3 className="text-xl font-semibold pt-6" style={{ color: '#554c4f' }}>تابعنا على</h3>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <a href="https://www.instagram.com/zhrt_alatw" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-[#a65b86] hover:text-[#8f436a] transition-colors">
                    <Instagram size={30} aria-hidden="true" />
                  </a>
                  <a href="https://wa.me/96876347266?text=" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="text-[#a65b86] hover:text-[#8f436a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z"/></svg>
                  </a>
                </div>
              </motion.div>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</Label>
                  <Input type="text" id="name" name="name" required className="w-full border-gray-300 focus:border-[#a65b86] focus:ring-[#a65b86] rounded-md shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</Label>
                  <Input type="email" id="email" name="email" required className="w-full border-gray-300 focus:border-[#a65b86] focus:ring-[#a65b86] rounded-md shadow-sm" />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">رسالتك</Label>
                  <textarea id="message" name="message" rows="4" required className="w-full border-gray-300 focus:border-[#a65b86] focus:ring-[#a65b86] rounded-md shadow-sm"></textarea>
                </div>
                <div>
                  <Button type="submit" style={{ backgroundColor: '#a65b86', color: 'white' }} className="w-full hover:bg-[#c07faa] transition-colors">
                    إرسال الرسالة
                  </Button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      );
    };

    export default ContactPage;