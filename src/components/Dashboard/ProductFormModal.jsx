import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { supabase } from '@/lib/supabaseClient';
    import { v4 as uuidv4 } from 'uuid';
    import { X } from 'lucide-react';

    const ProductFormModal = ({ isOpen, setIsOpen, currentProduct, fetchProducts, toast }) => {
      const initialFormState = { name: '', price: '', description: '', category: '', perfume_type: '', image_urls: [] };
      const [productForm, setProductForm] = React.useState(initialFormState);
      const [selectedFiles, setSelectedFiles] = React.useState([]);
      const [isProcessing, setIsProcessing] = React.useState(false);
      const [previewImages, setPreviewImages] = React.useState([]);

      React.useEffect(() => {
        if (currentProduct) {
          setProductForm({
            name: currentProduct.name || '',
            price: currentProduct.price || '',
            description: currentProduct.description || '',
            category: currentProduct.category || '',
            perfume_type: currentProduct.perfume_type || '',
            image_urls: currentProduct.image_urls || [],
          });
          setPreviewImages(currentProduct.image_urls || []);
        } else {
          setProductForm(initialFormState);
          setPreviewImages([]);
        }
        setSelectedFiles([]); 
      }, [currentProduct, isOpen]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
      };

      const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          setSelectedFiles(prevFiles => [...prevFiles, ...files]);
          const newPreviews = files.map(file => URL.createObjectURL(file));
          setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
      };

      const removeImage = (index, isExistingImage) => {
        if (isExistingImage) {
          setProductForm(prev => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index)
          }));
          setPreviewImages(prev => prev.filter((_, i) => i !== index));
        } else {
          setSelectedFiles(prev => prev.filter((_, i) => i !== index));
          setPreviewImages(prev => {
            const existingImageCount = productForm.image_urls?.length || 0;
            return prev.filter((_, i) => i !== (index + existingImageCount));
          });
        }
      };

      const uploadImages = async (filesToUpload) => {
        if (!filesToUpload || filesToUpload.length === 0) return [];

        const uploadPromises = filesToUpload.map(async (file) => {
          const fileName = `${uuidv4()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('product_images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            console.error('Error uploading image:', error);
            toast({ title: "خطأ في رفع الصورة", description: `${file.name}: ${error.message}`, variant: "destructive" });
            throw error; 
          }
          
          const { data: publicUrlData } = supabase.storage.from('product_images').getPublicUrl(fileName);
          if (!publicUrlData || !publicUrlData.publicUrl) {
              const urlError = new Error(`Failed to get public URL for ${file.name}.`);
              console.error(urlError.message);
              toast({ title: "خطأ في الحصول على رابط الصورة", description: urlError.message, variant: "destructive" });
              throw urlError;
          }
          return publicUrlData.publicUrl;
        });

        return Promise.all(uploadPromises);
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true); 
        let finalImageUrls = [...(productForm.image_urls || [])];

        try {
          if (selectedFiles.length > 0) {
            const uploadedUrls = await uploadImages(selectedFiles);
            finalImageUrls = [...finalImageUrls, ...uploadedUrls];
          }
          
          // Delete images that were removed by the user from existing images
          if (currentProduct && currentProduct.image_urls) {
            const removedUrls = currentProduct.image_urls.filter(url => !productForm.image_urls.includes(url));
            if (removedUrls.length > 0) {
              const imageNamesToRemove = removedUrls.map(url => url.split('/').pop());
              const { error: removeError } = await supabase.storage.from('product_images').remove(imageNamesToRemove);
              if (removeError) {
                console.warn('Could not remove some old images:', removeError.message);
              }
            }
          }


          const productDataToSave = { ...productForm, image_urls: finalImageUrls };
          
          let dbError;
          if (currentProduct) {
            const { error: updateError } = await supabase
              .from('products')
              .update(productDataToSave)
              .eq('id', currentProduct.id);
            dbError = updateError;
            if (!dbError) toast({ title: "تم تعديل المنتج بنجاح!" });
          } else {
            const { error: insertError } = await supabase
              .from('products')
              .insert([productDataToSave]);
            dbError = insertError;
            if (!dbError) toast({ title: "تم إضافة المنتج بنجاح!" });
          }

          if (dbError) {
            console.error('Error saving product to DB:', dbError);
            toast({ title: "خطأ في حفظ المنتج", description: dbError.message, variant: "destructive" });
          } else {
            setIsOpen(false);
            fetchProducts();
          }
        } catch (err) {
          console.error('Exception during product save process:', err);
          toast({ title: "خطأ فادح أثناء عملية الحفظ", description: err.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
      };

      if (!isOpen) return null;

      const combinedPreviews = [
        ...(productForm.image_urls || []).map(url => ({ url, isExisting: true })),
        ...selectedFiles.map(file => ({ url: URL.createObjectURL(file), isExisting: false, name: file.name }))
      ];


      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#8f436a' }}>
              {currentProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنتج</Label>
                <Input id="name" name="name" value={productForm.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="price">السعر</Label>
                <Input id="price" name="price" type="number" step="any" value={productForm.price} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <textarea id="description" name="description" value={productForm.description} onChange={handleInputChange} rows="3" className="w-full border-gray-300 focus:border-[#a65b86] focus:ring-[#a65b86] rounded-md shadow-sm"></textarea>
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Input id="category" name="category" value={productForm.category} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="perfume_type">اسم العطر</Label>
                <Input id="perfume_type" name="perfume_type" value={productForm.perfume_type} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="images">صور المنتج (يمكن تحديد أكثر من صورة)</Label>
                <Input id="images" name="images" type="file" onChange={handleFileChange} accept="image/*" multiple disabled={isProcessing} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {combinedPreviews.map((img, index) => (
                    <div key={img.isExisting ? img.url : img.name} className="relative">
                      <img src={img.url} alt={`معاينة ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-0 right-0 h-6 w-6 p-1"
                        onClick={() => removeImage(img.isExisting ? productForm.image_urls.indexOf(img.url) : selectedFiles.findIndex(f => f.name === img.name), img.isExisting)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {currentProduct && currentProduct.image_urls && currentProduct.image_urls.length > 0 && selectedFiles.length === 0 ? "الصور الحالية معروضة. اختر ملفات جديدة لإضافة المزيد أو استبدالها." : "اختر ملفات الصور."}
                </p>
              </div>
              {/* Rating field removed */}
              {/* Stock field removed */}
              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>إلغاء</Button>
                <Button type="submit" style={{ backgroundColor: '#a65b86', color: 'white' }} className="hover:bg-[#c07faa]" disabled={isProcessing}>
                  {isProcessing ? 'جاري الحفظ...' : (currentProduct ? 'حفظ التعديلات' : 'إضافة المنتج')}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      );
    };

    export default ProductFormModal;