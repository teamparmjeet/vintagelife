'use client';
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboardnew/Dashboard';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Timer from "@/components/Timer/Timer"
export default function page() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = Cookies.get('hasSeenModal');

    if (!hasSeenModal) {
      setShowModal(true);
      Cookies.set('hasSeenModal', 'true', { expires: 1 }); // expires in 1 day
    }
  }, []);
  return (
    <>
      {/* <Dashboard2 /> */}
      <Timer />
      <div className="flex flex-col space-y-2">
        <Dashboard />
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-xl overflow-y-auto max-h-screen w-full md:w-4/5 lg:w-3/4 px-6 py-12 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold z-50"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center">

                <h3 className="text-xl font-bold text-white text-center bg-green-600  px-4 py-2 rounded">IMPORTANT NOTICE</h3>
              </div>
              <p className="text-gray-700 font-bold mt-2">To whomsoever it may concern</p>
            </div>

            <div className="text-gray-700 text-justify space-y-4">
              <p>
                This notice is published on behalf of the company <strong>Anaadioro Wellness Private Limited</strong>.
                The company hereby advises all direct sellers, consumers, prospects of the company,
                and anyone engaged with the company:
              </p>
              <p>
                That we do not have any recruitment zone apart from the head office of the company.
                We do not support or promote any recruitment plan, nor do we charge any fees/joining charges
                for joining the company.
              </p>
              <p>
                If anyone gives you any job offer and demands a fee, kindly inform the company immediately.
                The company is not liable for such transactions initiated by anyone.
              </p>
              <p>
                Please be aware of such fraudulent recruitment-based transactions.
                The company may take disciplinary or legal action against such individuals when such issues come
                to the notice of the company's management.
              </p>

              <hr className="my-6 border-t border-gray-300" />
              <div className="flex justify-center flex-col items-center">

                <h3 className="text-xl font-bold text-white text-center bg-green-600  px-4 py-2 rounded">महत्वपूर्ण सूचना</h3>
                <p className='text-black font-bold mt-2'>जो कोई भी इससे संबंधित है उसके लिए</p>
              </div>
              <p>
                यह नोटिस कंपनी <strong>अनादीप्रो वेलनेस प्राइवेट लिमिटेड</strong> की ओर से प्रकाशित किया गया है।
                कंपनी इसके द्वारा सभी प्रत्यक्ष विक्रेताओं, उपभोक्ताओं, कंपनी के प्रॉस्पेक्टस और कंपनी से जुड़े किसी भी व्यक्ति को सलाह देती है:
              </p>
              <p>
                कि न तो हमारे पास कंपनी के प्रधान कार्यालय के अलावा कोई व्यक्ति भर्ती क्षेत्र है और न ही हम किसी भर्ती योजना का समर्थन/प्रचार करते हैं,
                साथ ही हम कंपनी में शामिल होने के लिए कोई शुल्क नहीं लेते हैं।
              </p>
              <p>
                यदि कोई आपको कंपनी में नौकरी के प्रस्ताव के लिए शुल्क की मांग करता है, तो कृपया तुरंत कंपनी को सूचित करें।
                कंपनी ऐसे किसी भी लेनदेन के लिए उत्तरदायी नहीं है।
              </p>
              <p>
                कृपया ऐसे धोखाधड़ी वाले लेनदेन से सावधान रहें। कंपनी इस प्रकार के मामलों के सामने आने पर संबंधित व्यक्ति के खिलाफ
                अनुशासनात्मक या कानूनी कार्रवाई कर सकती है।
              </p>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
