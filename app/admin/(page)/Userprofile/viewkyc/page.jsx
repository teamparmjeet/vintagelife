"use client";
import React from 'react';
import PanCardDetails from '@/app/admin/component/viewkyc-card/PanCardDetails';
import AadharcardDetails from '@/app/admin/component/viewkyc-card/AadharcardDetails';
import AddressProof from '@/app/admin/component/viewkyc-card/AddressProof';
import BankDetails from '@/app/admin/component/viewkyc-card/BankDetails';


export default function page() {
    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Uploaded ID Proof&apos;s
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PanCardDetails />
                    <AadharcardDetails />
                    <AddressProof />
                    <BankDetails />
                </div>
            </div>
        </>
    )
}
