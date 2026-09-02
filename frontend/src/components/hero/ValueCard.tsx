import { Lock } from 'lucide-react';

export const ValueCard = () => {
  return (
    <div className="border-l border-slate-200 pl-8 py-2">
      <div className="w-8 h-[3px] bg-[#D4836A] mb-4"></div>
      
      <Lock className="w-5 h-5 text-slate-700 mb-2" />
      
      <h3 className="font-serif text-xl font-medium text-slate-900 mt-2 mb-2">
        Ruang Aman untuk Berbagi
      </h3>
      
      <p className="text-sm text-slate-600 leading-relaxed">
        Berceritalah dengan tenang, secara anonim maupun menggunakan namamu. Proses moderasi kami memastikan setiap suara dijaga dengan rasa empati dan kemanusiaan.
      </p>
    </div>
  );
};
