'use client';
import React, { useEffect, useState } from 'react';

import Dashboard from '@/components/Dashboardnew/user/Dashboard';
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
            <Dashboard />
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-xl shadow-2xl overflow-y-auto max-h-screen w-full md:w-4/5 lg:w-3/4 p-6 md:p-10 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold z-50"
                            aria-label="Close Notice Modal"
                        >
                            ×
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-extrabold text-white bgn inline-block px-6 py-2 rounded-lg shadow">
                                IMPORTANT NOTICE
                            </h3>
                            <p className="text-gray-800 font-semibold mt-4 text-lg">
                                To whomsoever it may concern
                            </p>
                        </div>

                        <div className="text-gray-700 text-justify space-y-4 leading-relaxed">
                            <p>
                                This notice is published on behalf of the company <strong className="text-black">Vintage Life Wellness Pvt. Ltd.</strong>.
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

                            <hr className="my-8 border-t border-gray-300" />

                            <div className="text-center">
                                <h3 className="text-2xl font-extrabold text-white bgn inline-block px-6 py-2 rounded-lg shadow">
                                    महत्वपूर्ण सूचना
                                </h3>
                                <p className="text-black font-semibold mt-4 text-lg">
                                    जो कोई भी इससे संबंधित है उसके लिए
                                </p>
                            </div>

                            <p>
                                यह नोटिस कंपनी <strong className="text-black">विंटेज लाइफ वेलनेस प्राइवेट लिमिटेड</strong> की ओर से प्रकाशित किया गया है।
                                कंपनी इसके द्वारा सभी प्रत्यक्ष विक्रेताओं, उपभोक्ताओं, कंपनी के संभावित ग्राहकों और कंपनी से जुड़े किसी भी व्यक्ति को सलाह देती है:
                            </p>
                            <p>
                                कि हमारे पास कंपनी के मुख्यालय के अलावा कोई अधिकृत भर्ती केंद्र नहीं है। हम किसी भर्ती योजना का समर्थन नहीं करते हैं,
                                और कंपनी में शामिल होने के लिए कोई शुल्क नहीं लेते हैं।
                            </p>
                            <p>
                                यदि कोई व्यक्ति आपको नौकरी का प्रस्ताव देता है और शुल्क मांगता है, तो कृपया तुरंत कंपनी को सूचित करें।
                                कंपनी ऐसे किसी भी लेन-देन के लिए जिम्मेदार नहीं होगी।
                            </p>
                            <p>
                                कृपया ऐसे धोखाधड़ी वाले लेन-देन से सतर्क रहें। यदि कंपनी के प्रबंधन को इस प्रकार की किसी गतिविधि की जानकारी मिलती है,
                                तो वह संबंधित व्यक्ति के खिलाफ अनुशासनात्मक या कानूनी कार्रवाई कर सकती है।
                            </p>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}
