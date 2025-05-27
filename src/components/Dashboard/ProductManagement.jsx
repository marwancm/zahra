import React from 'react';
    import { Button } from '@/components/ui/button';

    const ProductManagement = ({ products, isLoading, openEditModal, deleteProduct }) => (
      <div>
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="w-full min-w-max text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">الصورة</th>
                <th className="p-4 font-semibold text-gray-600">الاسم</th>
                <th className="p-4 font-semibold text-gray-600">السعر</th>
                <th className="p-4 font-semibold text-gray-600">الفئة</th>
                <th className="p-4 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-16 w-16 object-cover rounded-md" />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                        الصور
                      </div>
                    )}
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.price} ر.ع.</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(product)} className="border-[#8f436a] text-[#8f436a] hover:bg-[#8f436a] hover:text-white">تعديل</Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>حذف</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 py-10">لا توجد منتجات لعرضها. قم بإضافة منتج جديد.</p>
          )}
          {isLoading && (
             <p className="text-center text-gray-500 py-10">جاري تحميل المنتجات...</p>
          )}
        </div>
      </div>
    );

    export default ProductManagement;