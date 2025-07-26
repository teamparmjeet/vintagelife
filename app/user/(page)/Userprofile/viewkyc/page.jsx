"use client";
import React from 'react';
import PanCardDetails from '@/app/admin/component/viewkyc-card/PanCardDetails';
import AadharcardDetails from '@/app/admin/component/viewkyc-card/AadharcardDetails';
import AddressProof from '@/app/admin/component/viewkyc-card/AddressProof';
import BankDetails from '@/app/admin/component/viewkyc-card/BankDetails';


export default function page() {
    return (
        <>
            <div className=" border border-gray-200  p-2 lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800lg:mb-7">
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
