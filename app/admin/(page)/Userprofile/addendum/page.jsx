"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from 'next/image'
export default function page() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        if (response.data?.name) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);
  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 text-gray-900">
      <h6 className=' font-bold text-right'> ANNEX:______</h6>
      <h5 className="text-center text-lg font-semibold underline"> Sample of Addendum Contract with Direct Sellers/Distributors ADDENDUM
        AGREEMENT</h5>
      <p className=" text-lg mt-5 text-justify"> Now it’s further agreement witnesses and it is further agreed by and between the parties
        here to as follow apart the main Contract with Direct Sellers/Distributors:-</p>

      <p className='text-lg mt-2 text-justify'>
        <span className=" font-semibold text-lg"> Definitions: </span> -In respect of the definition of  <span className=" font-semibold text-lg"> Direct seller </span>, we further agreed for the following
        revised definition of <span className=" font-semibold text-lg"> Direct seller -</span>
      </p>

      <p className='text-lg mt-2 text-justify'> <span className=" font-semibold text-lg">“Direct seller”</span> means a person appointed or authorized directly or indirectly by a Direct
        selling Entity through a legally enforceable written contract to undertake direct selling
        business on principal to principal basis. <span className=" font-semibold text-lg">Explanation</span> - The ‘written contract’ includes econtract or digital contracts and the same shall be governed as per the provision of the
        information Technology Act, 2000.In respect of the definition of Direct Selling
        Entity/Company, we further agreed for the following revised definition of Direct Selling
        Entity/Company-</p>


      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg">“Direct Selling Entity/Company”</span>
        Means a Company namely M/s ANAADIPRO
        WELLNESS PRIVATE LIMITED and running its main business in the name and style of
        “ANAADIPRO WELLNESS” and for the purpose of thease guidelines direct selling enitity
        menas the Board of Directors or to secretary or manager or any other person
        competent/authorized by the company.In respect of the definition of Agreement, we further
        agreed for the following new definition of Agreement as per follows –</p>

      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg">Agreement –</span>
        menas agreementas per Indian contract Act, 1872 and the ‘written contract’
        or ‘Agreement’ includes e-contract or digital contracts and the same shall be governed as
        per the provision of the information Technology Act, 2000.</p>

      <p className='text-lg mt-2 text-justify'>
        The Appointment /Authorization for Direct seller In respect of the The Appointment
        /Authorization for Direct seller, after point (b) (IV), we further agreed for the following
        terms- (ba). That in respect of the KYC, the direct seller shall include and not limited
        verified proof of address, proof of identity and PAN. The Direct seller shall submit PAN to
        the company as per the provisions of the income tax Act, 1961. The Direct seller should
        also submit to Company, any photo ID Card as issued by the state or central Government.
        These ID cards could be from the following –a.Aadhaar Car.b.Voter ID Cardc.Passport
        d.Ration carde.Any identity document issued by the state or central government which can
        be verified.Cooling-off Period— In respect of the colloing off period, after point (i) to (iii),
        we further agreed for the following terms-(iv)That if the company receive any fee, including
        any training fee, franchisee fee, fees for promotional materials or other fees related solely
        to the right to the participate as Direct seller, the Direct seller have the right to receive
        such fees, taining fees fees for promotional materials or other fees from the company upon
        the return of all goods received at the time of joining. Then such company shall be
        responsible to pay the such fees which is related to solely to the participate as Direct seller
        through the cash/Cheque/DD/NEFT/RTGS/Net Banking after after adjustment of
        appliclabe taxes like TDS, GST etc to the Direct seller with repudiate letter.</p>





      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg">General terms and conditions –</span>
        In respect of the General terms and conditions, after point
        (a) to (q), we further agreed for the following terms(r). That the company shall be
        responsible for the quality of products and services sold by by direct seller and further the
        company will gudie and help the direct seller to follow best practices in the interest of the
        consumer about the products and business opportunity in the legal and ethical manner, if
        any direct seller work, out of the purview of policy, guideance of the company than such
        direct seller shall be responsible for his/her all the activites in sales of product/service.
      </p>

      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg"> Obligations of Direct Seller Entity/Company towards Direct seller –</span>
        In respect of the
        Obligations of Direct Seller Entity/Company towards Direct seller, after point h of (VII) and
        point (VIII), we further agreed for the following terms-That the Company shall not
        Knowingly make, omit, engage or cuase, or permit to be made, any representation relating
        to tis Direct selling practice, including remuneration system and agreement between itself
        & the direct seller or the goods or services being sold by itself or by the direct seller which
        is false or misleading;That the training/oriention will be provided by the Direct Selling
        Entity/Company or by a Direct seller or by any authorized representative of company,
        either in person or through any digital means.</p>

      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg"> Suspension, Revocation or Termination of agreement –</span>
        In respect of the Suspension,
        Revocation or Termination of agreement, after point (V), we further agreed for the
        following terms- That upon the termination of the contract between company and direct
        seller, the company shall be lible to refund the deposit (if any) of terminated direct seller
        within the 30 days since the date of termination. Further, the company shall also be lible to
        pay penalty at the rate of 1% per day of the such deposit money, if it fails to return the
        such deposit after completion of the 30 days since the date of termination.</p>


      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg"> Governing Laws and Regulation –</span>
        In respect of the Governing Laws and Regulation, after
        point (V), we further agreed for the following terms-(I)That this Agreements shall be
        governed by the Indian Contract, 1872, The consumer Protection Act, 1986, “Advisory to
        state Government/Union territories on Model Guideline on Direct selling” issued by the
        Department of consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution,
        Government of India Dt. 09th Sep. 2016 F.NO. 21/18/2014-IT(Vol-II). laws, Rules,
        regulation and Direction issued by the Central and State Government of India and any
        proceedings arising out of this Agreements shall be initiated in the appropriate Indian court
        and all orders and decrees would be expressed in Indian language.(II) That the parties
        hereby agree that nothing contained herein shall prejudice the right of the company to
        appoint another Direct seller in the same territory or to open retail outlets if found
        necessary.
      </p>

      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg">Dispute Settlement –</span>
        In respect of the Dispute Settlement, after point (III), we further
        agreed for the following terms-That in the event of faliure of any of the above clauses, the
        company or direct seller may approach to any mediation center or aribitrator or any
        appointed authority of the state government at District/state level (If any).</p>

      <p className='text-lg mt-2 text-justify'><span className=" font-semibold text-lg">The Direct seller hereby covenants that as under : –</span>
        (I)That he/she has clearly
        understood the application form, marketing methods/plan, the compensation plan, terms of
        this addendum, its limitations and conditions and he/she is not relying upon any
        representation or promises that is not set out in these terms and conditions or other official
        printed or published materials of the Company.(II) That Relation between the Company
        and the Direct Seller and all his/her activities here under shall be governed in addition to
        this agreement, by the rules / procedure contained in the marketing plan, available on
        website. The Direct Seller confirms that he/she has read out all the terms & conditions
        thereof and agrees to be bound by them.(III) Shall act as a freelance body and shall not
        commit any misfeasance or malfeasance to create any liability/obligation over the
        Company of whatsoever nature.(IV) That the Direct Seller is not an agent, Employee or
        any other Legal representative of the Company or its service providers.(V) That Any
        payment received by the Direct Seller from any person declaring that the amount is being
        received for and on behalf of the Company shall not be deemed to be received by the
        Company. Direct seller is not authorized to receive any money for and on behalf of the
        Company.(VI) That Direct Seller, hereby declare that all the information furnished to the
        Company are true and correct. Company shall be at sole discretion and liberty to take any
        action against the Direct Seller in the event, it is discovered that the Direct Seller furnished
        any wrong/false information to the Company.(VII) That I am the concerned person hence
        fully conversant with the fact deposed above. and I have agreed without any pressure to
        be appointed as Direct Seller in whole India on terms and condition as contained in this
        agreement.(VIII) That I have read and understood the terms and conditions for
        appointment of Direct Seller of the Company and I have also gone through the Company's
        official website, printed materials, brochures and convinced about the business and I have
        applied to appoint me as a Direct Seller on my own volition. I undertake to adhere for
        policies, procedures, rules and regulations formed by the Company and I confirm having
        read/been explained and understood the contents of the document on policy and
        procedures of the appointment of Direct SellerIN WITNESS WHEREOF the parties hereto
        have caused this Addendum Agreement to be executed through their respective
        Authorized representatives on the {new Date(data?.createdAt).toLocaleDateString('en-GB')}</p>

      <p className="text-lg mt-4 font-bold">
        Read over by me / to me and agreed by me on {new Date(data?.createdAt).toLocaleDateString('en-GB')}
      </p>
      <p className="mt-4">
        _______________________________
        <br />
        (Signature)
      </p>
      <p className="mt-4">
        <span className=" underline">{data?.name}</span>
        <br />
        (Name of Applicant)
      </p>
      <p className="mt-4 font-semibold">Sign and Seal of the Company</p>
      <Image
        width={150}
        height={150}
        alt=''
        src="/images/homepage/Screenshot 2025-04-19 151921.png"
      />
      <p className="mt-4 font-semibold">Witnesses:</p>
      <p>
        Name: ____________________________
        <br />
        Name: ____________________________
      </p>

    </div>
  )
}
