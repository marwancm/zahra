import React from 'react';
    import { Button } from '@/components/ui/button';

    const BannerManagement = ({ banners, isLoading, openEditModal, deleteBanner }) => (
      <div>
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="w-full min-w-max text-right">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="p-4 font-semibold text-gray-600">الصورة</th>
                <th scope="col" className="p-4 font-semibold text-gray-600">العنوان</th>
                <th scope="col" className="p-4 font-semibold text-gray-600">نشط</th>
                <th scope="col" className="p-4 font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {banner.image_url ? (
                      <img src={banner.image_url} alt={banner.title} className="h-16 w-32 object-cover rounded-md" />
                    ) : (
                      <div className="h-16 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                        لا صورة
                      </div>
                    )}
                  </td>
                  <td className="p-4">{banner.title}</td>
                  <td className="p-4">{banner.is_active ? 'نعم' : 'لا'}</td>
                  <td className="p-4 space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(banner)} className="border-[#8f436a] text-[#8f436a] hover:bg-[#8f436a] hover:text-white">تعديل</Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteBanner(banner.id)}>حذف</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {banners.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 py-10">لا توجد بانرات لعرضها. قم بإضافة بانر جديد.</p>
          )}
          {isLoading && (
            <p className="text-center text-gray-500 py-10">جاري تحميل البانرات...</p>
          )}
        </div>
      </div>
    );

    export default BannerManagement;