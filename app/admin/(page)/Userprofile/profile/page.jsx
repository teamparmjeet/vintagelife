import React from 'react'
import UserAddressCard from '@/components/user-profile/UserAddressCard'
import UserMetaCard from '@/components/user-profile/UserMetaCard'
import UserInfocard from '@/components/user-profile/UserInfoCard'
import NomineeDetails from '@/components/user-profile/NomineeDetails'

export default function page() {
    return (
        <>
            <div className="space-y-3">
                <UserMetaCard />
                <UserInfocard />
                <UserAddressCard />
                <NomineeDetails />
            </div>
        </>
    )
}
