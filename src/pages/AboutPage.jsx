import React from 'react';
    import { motion } from 'framer-motion';
    import { Star, ShoppingBag, MapPin } from 'lucide-react';
    import aboutimg from '../../public/about.jpg'

    const AboutPage = () => (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8" style={{ color: '#8f436a' }}>عن زهرة للعطور</h1>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-1/3"
            >
              <img  className="rounded-lg shadow-lg w-full h-auto object-cover" alt="زهرة للعطور - شعار أو صورة معبرة" src={aboutimg} />
            </motion.div>
            <div className="w-full md:w-2/3 text-lg text-gray-700 space-y-4 leading-relaxed">
              <p>"زهرة للعطور الراقية" 🌸💆🏻‍♂️ - اسم له تاريخ في عالم العطور الفاخرة. نحن نفخر بتقديم تشكيلة فريدة من العطور التي تجمع بين الأصالة الشرقية والإبداع الحديث.</p>
              <p>في "زهرة"، نؤمن بأن العطر ليس مجرد رائحة، بل هو تعبير عن الشخصية ووسيلة لإبراز الجمال الداخلي والخارجي. كل قطرة من عطورنا تحمل قصة، وكل زجاجة هي تحفة فنية.</p>
              <p>نحن متواجدون في قلب سلطنة عُمان 🇴🇲، ونسعى جاهدين لتقديم تجربة تسوق استثنائية لعملائنا، مع التركيز على الجودة العالية والخدمة المتميزة.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-gradient-to-br from-[#a65b86] to-[#8f436a] text-white rounded-lg shadow-md"
            >
              <Star size={40} className="mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">جودة عالية</h3>
              <p className="text-sm">نختار أجود المكونات لضمان عطور تدوم طويلاً.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 bg-gradient-to-br from-[#a65b86] to-[#8f436a] text-white rounded-lg shadow-md"
            >
              <ShoppingBag size={40} className="mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">تشكيلة واسعة</h3>
              <p className="text-sm">مجموعة متنوعة تناسب جميع الأذواق والمناسبات.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-6 bg-gradient-to-br from-[#a65b86] to-[#8f436a] text-white rounded-lg shadow-md"
            >
              <MapPin size={40} className="mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">صنع في عُمان</h3>
              <p className="text-sm">نفخر بتقديم منتجات مستوحاة من تراثنا الغني.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );

    export default AboutPage;