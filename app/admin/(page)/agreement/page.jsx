"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
export default function AgreementPage() {
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
  if (fetching) return <div>Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 text-gray-900">
      <div className="my-8 text-md">
        <p className="text-center font-semibold mb-6">AGREEMENT</p>

        <p className="mb-4">
          This agreement is signed on the{" "}
          <span className="underline">{new Date(data?.createdAt).toLocaleDateString('en-GB')}</span> by and between
          <span className="font-semibold">
            {" "}
            ANAADIPRO WELLNESS PRIVATE
            LIMITED
          </span>
          , a company registered under the Companies Act 2013 having its
          Registered office at
          <span className="underline">
            {" "}
            Hore
            Chandra Nagar. DTR P9 Noel School Gird Gwalior Fort Gwalior, [M.P.] INDIA - 474008
          </span>{" "}
          acting through its Director
          <span className="underline"> Director Mr. NARENDRA MEENA</span>{" "}
          hereinafter called Company (which expression shall, unless repugnant
          to the context, include its successors in business, administrators,
          liquidators and assigns or legal representatives) of the FIRST PARTY
        </p>
        <p className="font-semibold"> AND </p>

        <p className="mb-4">
          Shri/Smt. <span className="underline">{data?.name}</span> aged{" "}
          <span className="underline">{calculateAge(data?.dob)}</span> years, S/o. d/o w/o{" "}
          <span className="underline">{data?.fatherOrHusbandName}</span> Address,{" "}
          <span className="underline">{data?.address?.addressLine1}</span>{" "}
          District, <span className="underline">{data?.address?.city}</span> State,{" "}
          <span className="underline">{data?.address?.state}</span> <span className=" font-semibold">(DIRECT SELLER CODE
            ISSUED BY THE COMPANY </span>
          <span className=" inline-block px-4 border-b-2 border-black"> {data?.dscode}</span>
          ) (hereinafter called as Direct Seller
          which expression shall include my/our heirs, executors and administrators
          estates assigns and effects wherein the context so admits or requires) of the
          second party.

        </p>

        <p className="font-semibold mb-2">Definitions:</p>
        <p className="mb-4">
          The following words used in these presents shall have the meaning as
          defined here under:
        </p>



      </div>
      <div>
        <ul className="list-disc list-inside space-y-2">
          <li className="text-justify">
            <strong>“ACT”</strong> means the Consumer Protection Act, 1986 (68
            of 1986).
          </li>

          <li className="text-justify">
            <strong>“Consumer”</strong> means who buys goods or services for
            personal (self) use and not for resale or commercial purposes, and
            shall have the same meaning as provided under the Consumer
            Protection Act, 1986.
          </li>

          <li className="text-justify">
            <strong>“Prospect”</strong> means a person to whom an offer or a
            proposal is made by the Direct seller to join a Direct selling
            opportunity.
          </li>

          <li className="text-justify">
            <strong>“Direct seller”</strong> means a person appointed or
            authorized directly or indirectly by a Direct Selling Entity through
            a legally enforceable written contract to undertake direct selling
            business on a principal-to-principal basis.
          </li>

          <li className="text-justify">
            <strong>“Network of Direct Selling”</strong> means a network of
            direct sellers at different levels of distribution who may recruit,
            introduce, or sponsor further levels of direct sellers whom they
            then support.
          </li>

          <li className="text-justify">
            <strong>Explanation:</strong> “Network of Direct Selling” shall mean
            any system of distribution or marketing adopted by a Direct Selling
            Entity to undertake direct selling business and shall include the
            multi-level marketing method of distribution.
          </li>

          <li className="text-justify">
            <strong>“Direct Selling”</strong> means marketing, distribution, and
            sale of goods or providing services as a part of a network of Direct
            Selling, other than under a pyramid scheme. Provided that such sale
            of goods or services occurs otherwise than through a permanent
            retail location to consumers, generally in their houses, workplaces,
            or through explanation and demonstration of such goods and services
            at a particular place.
          </li>

          <li className="text-justify">
            <strong>“Direct Selling Entity”</strong> means an entity not being
            engaged in a pyramid scheme, which sells or offers to sell goods or
            services through a direct seller. Provided that “Direct Selling
            Entity” does not include any entity or business notified otherwise
            by the Government for the said purpose from time to time.
          </li>

          <li className="text-justify">
            <strong>“Goods”</strong> means goods/products defined in the Sale of
            Goods Act, 1930, and section 3(26) of the General Clauses Act, 1897,
            including every kind of movable property other than actionable
            claims and money. <strong>“Services”</strong> means service as
            defined in the Consumer Protection Act, 1986.
          </li>

          <li className="text-justify">
            <strong>"Saleable</strong> shall mean , with respect to goods and/
            or services, unused and marketable, which has not expired and which
            is not seasonal, discontinued or special promotion Goods and /or
            services.
          </li>

          <li className="text-justify">
            <strong>“cooling off period”</strong>" means the duration of time
            counted from the date when the direct seller and the direct selling
            entity into an agreement under clause 4 and ending with date on
            which the contract is to be performed and within which the direct
            seller may repudiate the agreement without being subject to penalty
            for breach of contract.
          </li>
          <li className="text-justify">
            <strong>“Pyramid Scheme ”</strong>means: A multi layered network of
            subscribers to a scheme formed of subscribers enrolling one or more
            subscribers in order to receive any benefit, directly or indirectly
            as a result of enrollment action or performance of additional
            subscribers to the scheme. The subscribers enrolling further
            subscriber(S) occupy higher position and the enrolled subscriber(s)
            lower position, thus with successive enrolments, they form
            multi-layered network of subscribers. Provided that the above
            definition of a "Pyramid Scheme" shall not apply to a multi layered
            network of subscribers to a scheme by a direct selling Entity. Which
            consists of subscribers enrolling one or more subscribers in order
            to receive any benefit, directly or indirectly, where the benefit is
            as a result of sale of goods or services by subscribers and the
            scheme /financial arrangement complies with all of the following:
          </li>
        </ul>
      </div>
      <div>
        <ol className="list-decimal list-inside space-y-4">
          <li className="text-justify">
            It has no provision that a Direct Seller will receive remuneration
            or incentive for the recruitment/enrollment of new participants.
          </li>

          <li className="text-justify">
            It does not require a participant to purchase goods or services for
            an amount that exceeds an amount for which such goods or services
            can be expected to be sold or resold to consumers.
          </li>

          <li className="text-justify">
            For a quantity of goods or services that exceeds an amount that can
            be expected to be consumed by or sold or resold to consumers.
          </li>

          <li className="text-justify">
            It does not require a participant to pay any entry/registration fee,
            cost of sales demonstration equipment and materials, or other fees
            relating to participation.
          </li>

          <li className="text-justify">
            It provides a participant with a written contract describing the{" "}
            <strong>"material terms"</strong> of participation.
          </li>

          <li className="text-justify">
            It allows or provides for a participant a reasonable cooling-off
            period to participate or cancel participation in the scheme and
            receive a refund of any consideration given to participate in the
            operations.
          </li>

          <li className="text-justify">
            It allows or provides for a buy-back or repurchase policy for{" "}
            <strong>"currently marketable"</strong> goods or services sold to
            the participant at the request of the participant at reasonable
            terms.
          </li>

          <li className="text-justify">
            It establishes a grievance redressal mechanism for consumers, more
            particularly described in clause 7 herein.{" "}
            <strong>a. Explanation:</strong> 1 for the purpose of this proviso
            the terms "material terms "shall means buy –back or repurchase
            policy , cooling off period , warranty and refund policy.
          </li>
        </ol>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-justify">
            <strong>“Money Circulation Scheme”</strong> has the same meaning as
            defined under the Prize Chits and Money Circulation Scheme Act,
            1978.
          </li>

          <li className="text-justify">
            <strong>“Remuneration System”</strong> means the system followed by
            the direct selling entity to compensate the direct seller,
            illustrating the mode of sharing of incentives, profits, and
            commissions, including financial and non-financial benefits, paid by
            the direct selling entity to the direct sellers on a monthly,
            periodic, or yearly basis, as the case may be.
          </li>

          <li className="text-justify">
            This system for every Direct Selling Entity shall:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Have no provision that a direct seller will receive remuneration
                from the recruitment to participate in such direct selling.
              </li>
              <li>
                Ensure that direct sellers shall receive remuneration derived
                from the sale of goods or services.
              </li>
              <li>
                Clearly disclose the method of calculation of remuneration.
              </li>
              <li>State includes a Union Territory.</li>
            </ul>
          </li>
        </ul>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-justify">
            <strong>
              Authorized Support center /Franchisee/Super store/Sales
              Point/Sales Depot
            </strong>
            <p className="mt-1">
              A pick-up point and delivery point for maintaining an effective
              delivery system for goods/products of the company and established
              by the company.
            </p>
          </li>

          <li className="text-justify">
            <strong>Direct Selling Entity/Company</strong>
            <p className="mt-1">
              Means a company namely{" "}
              <strong>M/s ANAADIPRO WELLNESS PRIVATE LIMITED </strong>
              and running its main business in the name and style of ANAADIPRO
              WELLNESS.
            </p>
          </li>

          <li className="text-justify">
            <strong>Sales Incentive</strong>
            <p className="mt-1">
              Means the amount of any type of remuneration like commission,
              bonus, gifts, profits, incentives, etc., including financial and
              non-financial benefits payable to the Direct Seller for effecting
              the sale of goods/products as stipulated in the contract between
              the Direct Seller and Direct Selling Entity on a monthly,
              periodic, or yearly basis or both as the case may be. But the
              amount of remuneration from the recruitment to participate in such
              direct selling shall not be part of the sales incentive.
            </p>
          </li>

          <li className="text-justify">
            <strong>Unique ID</strong>
            <p className="mt-1">
              Means a unique identification number issued by the Company to the
              Direct Seller as a token of acceptance of his/her application for
              Direct Selling of the goods/products of the Company.
            </p>
          </li>

          <li className="text-justify">
            <strong>Password</strong>
            <p className="mt-1">
              Means a unique code allotted to each Direct Seller to allow them
              to log on to the website of the Company.
            </p>
          </li>

          <li className="text-justify">
            <strong>Website</strong>
            <p className="mt-1">
              Means the official website of the Company ANAADIPRO
              <a
                href="http:// www.annadiprowellness.com /"
                className="text-blue-600 hover:underline"
              >
                http:// www.annadiprowellness.com /
              </a>
            </p>
          </li>
        </ul>
      </div>
      <div>
        <p className="mt-6 text-justify">
          WHEREAS <strong>M/s ANAADIPRO WELLNESS PRIVATE LIMITED</strong>, a
          Company incorporated under the Companies Act, 2013, having its
          Registration No. <strong>CIN-U47890MP2025PTC074912</strong>
          and Registered Office at{" "}
          <strong>
            Hore Chandra
            Nagar.DTR P9 Noel School,Gird Gwalior Fort Gwalior [M.P.] INDIA - 474008
          </strong>{" "}
          hereinafter referred to as the Company. "ANAADIPRO WELLNESS".
        </p>
        <p className="text-justify mb-4">
          <strong>PRIVATE LIMITED</strong> takes immense pleasure in introducing
          the first-ever Retail concept with maximum benefit for customers. The
          Company is engaged in the business of direct selling through its
          Direct Seller and Retail Outlets as stated in the Object Clauses of
          the memorandum of Association of the Company.
        </p>
        <p className="text-justify mb-4">
          The company has sales tax/VAT, Income Tax, TDS, and other licenses as
          may be required as per the law/regulation/Guideline of its principal
          place of business and sales tax/VAT and other licenses for each retail
          outlet at various states in India. The company also has its own
          trademark to promote the products for sale/direct selling business,
          and the trademark identifies the company with the goods to be sold or
          supplied.
        </p>
        <p className="text-justify mb-4">
          For the smooth running of the business of direct selling, the Company
          has certain rules and regulations, a marketing plan, and other terms
          and conditions. Now, in order to simplify more, keep things more
          transparent, and control fraudulent practices for the betterment of
          direct selling activities through multilevel marketing, the Company is
          using a better trading and marketing plan to promote the sale of the
          company's products.
        </p>
        <p className="text-justify mb-4">
          The Company exclusively uses its website and Retail Outlet to display
          the details about products, product information, product quality
          certificate, price, complete income plan, marketing methods, business
          monitoring, and information regarding management, while also using
          word-of-mouth publicity to promote and create awareness about the
          website and its products.
        </p>
        <p className="text-justify mb-4">
          An Individual/Firm/Company who is able to do a contract as per the
          provisions of The Indian Contract Act, 1872, and wishes to become a
          direct seller of the company as per the new Guidelines issued by the
          Ministry of Corporate Affairs, Govt. of India, can execute this
          agreement as a Direct Seller to market and sell the company's products
          in the whole of India, in the prescribed form through online/manual.
        </p>
        <p className="text-justify font-bold">
          There is
          <span className="underline">
            NO deposit or any charges/enrollment fees/joining fees/renewal
            charges
          </span>
          for becoming a Direct Seller of the Company.
        </p>
        <p className="text-justify mb-4">
          Now it's agreement witnesses, and it is agreed by and between the
          parties here to as follow:-
        </p>
      </div>
      <div>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-justify">
            <strong>The Appointment / Authorization for Direct Seller</strong>
            <ul className="list-none pl-4 space-y-2">
              <li>
                (I) This agreement is only for <strong>OLD</strong> authorized
                Direct Sellers who already have a Direct Seller code, Login ID,
                and password in the company.
              </li>
              <li>
                (II) As per this new agreement, the Direct Seller accepts the
                proposed terms and conditions of the agreement.
              </li>
              <li>
                (III) The Direct Seller shall submit the following documents
                along with this agreement in hard copy to the company within{" "}
                <strong>30 days</strong> from the date of execution:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>(a) KYC Documents (self-attested)</li>
                  <li>
                    (b) Signed Executed Agreement (Including terms of
                    appointment)
                  </li>
                </ul>
                A Direct Seller, upon appending their signature at the bottom of
                these presents (agreement) and all attached documents, agrees to
                the terms.
              </li>
              <li>
                (a) The Company, upon scrutiny and verification of KYC and
                agreement, may reconsider the appointment of the Direct Seller
                for Direct Selling of the goods/products of the Company. The
                Company shall have sole discretion and liberty to reject the
                Direct Seller code if the KYC and other documents in hard copy
                are found unsatisfactory, mollified, or fake.
              </li>
              <li>
                (b) <strong>Cooling-off Period</strong>—
                <ul className="list-none pl-4 mt-2 space-y-1">
                  <li>
                    (I) The Direct Seller shall have the exclusive right to
                    reject/cancel the agreement within <strong>30 days</strong>{" "}
                    from the execution date of the agreement through the online
                    process. In this relation, the Direct Seller is responsible
                    for informing the company about such a decision within the
                    specified period through Email, registered letter, or speed
                    post at the company's registered mail ID/address.
                  </li>
                  <li>
                    (II) The Direct Seller shall have the right to return any
                    goods purchased during the cooling-off period, provided the
                    purchased goods are in saleable condition (i.e., any
                    seal/protection remains unbroken). The refund amount or
                    credit voucher shall be issued accordingly.
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <p className="text-justify mb-4">
          Paid by the company within <strong>30 days</strong> since the date of
          receipt of the product.
        </p>
        <p className="text-justify mb-4">
          (III) If such a Direct Seller receives any consideration from the
          company during this cooling-off period, then such Direct Seller shall
          be responsible for paying the amount of such consideration to the
          company with a repudiate letter in the form of{" "}
          <strong>CASH/CHEQUE/DD/NEFT/RTGS</strong>, etc.
        </p>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-justify">
            <strong>Scope of the Work</strong>
            <p className="mt-1">
              The Direct Seller shall market and sell the company's product
              directly to the end-user consumer, using word-of-mouth publicity,
              display, and/or demonstration of the goods/products, and/or
              distribution of pamphlets, door-to-door customers, and other
              related methods.
            </p>
          </li>

          <li className="text-justify">
            <strong>Direct Marketing Selling</strong>
            <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
              <li>
                The Direct Seller shall be responsible for marketing and selling
                the company's products door-to-door to customers, directly to
                the end-user consumer using word-of-mouth publicity, display,
                and/or demonstration of the goods/products, and/or distribution
                of pamphlets and other related methods.
              </li>
              <li>
                The Direct Seller can use the logo and name of the company for
                selling the company's products as per the company's policy and
                regulations.
              </li>
              <li>
                The Direct Seller will get a specified <strong>%/point</strong>,
                sales incentive/commission pertaining to the sales for selling
                the company's products under this Agreement. Payment of sales
                incentives/commission will be made after receipt of payment for
                the products sold/marketed under this Agreement by the Direct
                Seller. Further, if the company fails to recover the dues from
                its customers/subscribers, then no sales Incentives/Commission
                shall be paid by the company to the Direct Seller. The sales
                incentives/commission would be payable only after the
                dues/payment are realized from customers. If the payment is
                received on a <strong>monthly/quarterly/half-yearly</strong>{" "}
                basis, then in the same fashion, commission payment will be done
                automatically by the company after receipt of the said payment.
              </li>
              <li>
                The Company hereby covenants that it shall provide to the Direct
                Seller...
              </li>
            </ul>
          </li>
        </ul>
        <p className="text-justify mb-4">
          The company shall provide complete instruction books, catalogues, and
          circulars for promoting sales and shall offer initial training for
          Direct Selling. Additionally, the company shall publish advertisements
          in local and regional newspapers, TV, etc., to promote the sales of
          the company's products.
        </p>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-justify">
            The Direct Seller shall not be liable to pay the cost of brochures,
            sales demonstration equipment, materials, or any other
            participation-related fees.
          </li>
          <li className="text-justify">
            The company shall issue photo identity cards to the Direct Seller.
            This identity card must be returned to the company upon the expiry,
            termination, or revocation of the agreement and shall be destroyed.
            <p className="mt-1">
              The identity card shall include the Direct Seller’s name and
              unique Direct Seller number. It shall also clearly state that the
              Direct Seller is not authorized to collect cheques/demand drafts
              in their name from the customer. Any collected cheques or drafts
              must be drawn in the company’s name and deposited in the company’s
              office or designated locations within a day.
            </p>
            <p className="mt-1">
              The Direct Seller shall hold collected cash/cheques/DD in trust
              for the company. Failure to deposit the amount within the
              stipulated time shall make the Direct Seller liable for
              damages/compensation. The receipt/bill shall only be issued by the
              company and serves as valid documentary proof for the customer.
              The Direct Seller is not authorized to issue any receipts/bills on
              behalf of the company.
            </p>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-6">
          Facilities for Purchases of Products
        </h2>
        <p className="text-justify mt-2">
          The company may provide the following facilities for customers to
          purchase products:
        </p>
        <ul className="list-disc list-inside pl-4 mt-2">
          <li>Online Portal / E-commerce</li>
        </ul>
        <p className="text-justify mb-4">
          Any person who sells or offers for sale, including on an e-commerce
          platform/marketplace, any product of the company, must have prior
          written consent from the company in order to undertake or solicit such
          a sale or offer. Direct Sellers are required to visit the above
          facilities to make payments and collect valid receipts and products on
          behalf of consumers/customers.
        </p>
        <h2 className="text-lg font-semibold mt-6">
          Buy-back/Repurchase Policy
        </h2>
        <p className="text-justify mt-2">
          (I) The company provides a full refund or buy-back guarantee to every
          Direct Seller under the following terms:
        </p>
        <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
          <li>
            A Direct Seller who has purchased goods from the company for
            distribution or further sale is eligible to avail of the buy-back
            policy.
          </li>
          <li>
            If the purchased goods are not sold within <strong>30 days</strong>{" "}
            from the date of distribution and billing to the Direct Seller, they
            can be returned.
          </li>
          <li>
            The condition of purchased goods must be saleable, i.e., any
            seal/protection on the goods must be intact.
          </li>
          <li>
            If the above conditions are met, the Direct Seller can exercise
            their buy-back policy right within <strong>30 days</strong> from the
            distribution and billing date.
          </li>
          <li>
            The company is responsible for repurchasing goods upon submission of
            proof, including the original bill, delivery challan, ID, and
            address proof. The goods must be returned in their original
            condition.
          </li>
          <li>
            The company shall refund the full amount after deducting packaging,
            courier, and applicable taxes as per government norms.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-6">Warranty of the Goods</h2>
        <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
          <li>
            Goods sold by the company carry a manufacturer’s guarantee/warranty
            for a specified time. During this period, consumers can exchange,
            replace, or repair goods in case of defects.
          </li>
          <li>
            To claim the warranty, consumers must provide the original bill,
            delivery challan, and ID/address proof to the company along with the
            goods.
          </li>
        </ul>
        <h2 className="text-lg font-semibold">Refund Policy of the Goods</h2>
        <p className="text-justify mt-2">
          The consumer shall have two opportunities as follows:
        </p>
        <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
          <li>
            <strong>Exchange/Return:</strong> If the consumer finds any
            manufacturing defect or if the goods purchased are not useful for
            their intended purpose within <strong>30 days</strong> from the
            purchase date, they may be returned, provided the seal/protection
            remains intact.
          </li>
          <li>
            <strong>Full Refund:</strong> A consumer may request a full refund
            within <strong>30 days</strong> if the product is found defective or
            inferior in quality compared to the provided information, as long as
            the seal/protection remains unbroken.
          </li>
          <li>
            To initiate the refund process, the consumer must provide the
            original bill, delivery challan, and valid
            <strong> ID/Address Proof</strong> along with the goods.
          </li>
        </ul>
        <h2 className="text-lg font-semibold mt-6">
          Sales Incentives/Commission Structure or Other Benefits
        </h2>
        <p className="text-justify mt-2">
          The Direct Seller shall enjoy the following privileges:
        </p>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-2">
          <li>
            Sales incentives based on their respective sales volume, as per the
            company's marketing plan for its tie-up goods/products.
          </li>
          <li>
            Earnings proportional to the volume of sales made by the Direct
            Seller individually or through a team (Sales Group), as per the
            marketing plan.
          </li>
          <li>
            Freedom to market and sell the company's products anywhere in India
            without territorial restrictions.
          </li>
          <li>
            Ability to use a unique ID and password to inspect and manage their
            account on the company’s website.
          </li>
          <li>
            Opportunity to collaborate with other Direct Sellers as part of a
            sales team/group.
          </li>
          <li>
            No provision for remuneration from recruitment in direct selling.
          </li>
        </ul>
        <p className="text-justify mt-4">
          As per the company's marketing plan, sales incentives and commission
          structures will be followed accordingly.
        </p>
        <p className="text-justify mt-4">
          The company reserves the right to restrict the list of products
          available to a particular Direct Seller.
        </p>
        <h2 className="text-lg font-semibold">
          Sales Incentives/Commission Policy
        </h2>
        <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
          <li>
            Tariff revisions, government directives, and market forces may lead
            to changes in the company’s sales incentives/commission policy. The
            company's decision in this regard shall be final and binding.
          </li>
          <li>
            All payments and transactions shall be expressed in Indian Rupees.
          </li>
          <li>
            The company does not guarantee or assure any facilitation fees or
            income to the Direct Seller merely for being a part of the company.
          </li>
          <li>
            Sales incentives, commissions, and bonuses shall be subject to
            statutory deductions, such as TDS.
          </li>
          <li>
            The company shall provide complete and accurate information to both
            prospective and existing direct sellers regarding remuneration
            opportunities and their associated rights and obligations.
          </li>
          <li>
            The company shall ensure timely payments and applicable deductions
            in a commercially reasonable manner.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-6">
          General Terms and Conditions
        </h2>
        <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
          <li>
            The Direct Seller shall carry out appropriate canvassing for selling
            products in designated areas, with the support of the company and
            its sales team.
          </li>
          <li>
            The company shall not be responsible for any establishment, office
            expenses, or business operation costs for maintaining an office for
            the Direct Seller.
          </li>
          <li>
            The Direct Seller agrees to exclusively sell the company’s products
            and tie-up goods, refraining from engaging in the sale of similar or
            identical products. The Direct Seller must also ensure the
            protection of the company’s patents and trademarks.
          </li>
          <li>
            A unique identification number (UIN) will be assigned to each Direct
            Seller for transactions and communications with the company.The
            Unique Identification Number once chosen cannot be altered at any
            point of time.
          </li>
          <li>
            That No communication will be entertained without Unique
            Identification Number and password. Direct Seller shall preserve the
            Unique Identification Number and Password properly as it is must for
            logging on to website.
          </li>
          <li>
            That the Company reserves its right to withheld/block/suspend the
            Direct Seller in the event the Direct Seller fails to provide any
            details as desired by the Company from time to time like Pan Card
            details, KYC etc.
          </li>
          <li>
            That the Direct Seller shall be faithful to the Company and shall
            uphold the integrity and decorum to the Company and shall maintain
            good relations with other Direct Seller and other clients also.
          </li>
          <li>
            That the Direct seller shall be abide with policies, procedures,
            rules and regulations of the company and All privileges laws, rules
            and regulation and Direction and Guideline issued by the state and
            central Government of India from time to time.
          </li>
          <li>
            That the Company reserves the rights to modify the terms and
            conditions, products, plan, business and policies with/without
            giving prior notice. Such notice may be published through the
            official website of the Company, and any such modification/amendment
            shall be applicable and binding unto the Direct Seller from the date
            of such notice.
          </li>
          <li>
            That the Direct Seller shall comply with all state and central
            government and local governing body laws, regulations and codes that
            apply to the operation of their ANAADIPRO WELLNESS PRIVATE LIMITED
            business. Direct Seller must not engage in any deceptive of unlawful
            trade practice as defined by any central, state or local law or
            regulation.
          </li>
          <li>
            That the Direct Seller shall not manipulate the ANAADIPRO WELLNESS
            PRIVATE LIMITED marketing plan or product's rate, Point volume/
            Sales Point/ Business volume etc., in any way and Direct Seller
            shall not send, transmit or otherwise communicate any messages to
            anybody on behalf of the Company otherwise than for authorization
            for the same.
          </li>
          <li>
            That the Direct seller shall be libel to produce/show/explain the
            marketing/sales/trading plan of the company to the customer as it as
            he is received.
          </li>
          <li>
            That the Direct Seller and/or any other person is strictly
            prohibited to use Business Promotional Material, other than Business
            Promotional Material developed and/or authorized to develop by the
            Company.
          </li>
          <li>
            That the Direct Seller shall not use the ANAADIPRO WELLNESS PRIVATE
            LIMITED trademark, logotype and design anywhere without written
            permission from the Company. This permission can be withdrawn at any
            time by the Company.
          </li>
          <li>
            That All the arrangements, expenses, permission from local
            authorities, complying with rules of central and state government
            and local body is whole responsibility of Direct Seller for meetings
            and seminars conducted by Direct Seller.
          </li>
          <li>
            That No another Direct seller code shall be issued on same Pan Card.
          </li>
          <li>
            The Direct seller is agreed and authorized to the company to create
            his/her Sales and purchases books of accounts stating the details of
            the products, price, tax, and the quantity and such other details in
            respect of the goods sold by him/her, in such form as applicable law
            as mentioned in the sub-clause 5 of the clause 5- Certain obligation
            of Direct Sellers. In this relation the company shall be authorized
            to deduct the charges from the incentive of the Direct seller for
            prepare of such accounts on behalf of the Direct seller.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-6">
          Obligations of Direct Seller
        </h2>
        <p>That the Direct Seller engaged in direct selling shall</p>
        <ul className="list-decimal list-inside pl-4 mt-2 space-y-2">
          <li>
            carry their identity card and not visit the customer's premises
            without prior appointment/approval;
          </li>
          <li>
            At the initiation of a sales representation, without request,
            truthfully and clearly identify themselves, the identity of direct
            selling entity, the nature of the goods or services sold and the
            purpose of the solicitation to the prospective consumer;
          </li>
          <li>
            Offer a prospective consumer accurate and complete explanation and
            demonstrations of goods and services, prices, credit terms, terms of
            payment, return policies, terms of guarantee, after sales service;
          </li>
          <li>
            Provide the following information to the prospect/consumers at the
            time of sale, namely;
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                Name, address, registration number or enrollment number,
                identity proof and telephone number of direct seller and details
                of direct selling entity;
              </li>
              <li>A description of the goods or services to be supplied;</li>
              <li>
                Explain to the consumer about the goods return policy of the
                company in detail before the transaction.
              </li>
              <li>
                The order date, the total amount to be paid by the consumer
                along with the bill and receipt.
              </li>
              <li>
                Time and place for inspection of the sample and delivery of
                goods.
              </li>
              <li>
                Information of his/her rights to cancel the order and/or to
                return the product in saleable condition, i.e., any
                seal/protection on the goods is kept unbroken and avail full
                refund and sum paid.
              </li>
              <li>Detail regarding the complaint redressal mechanism.</li>
            </ul>
          </li>
          <li>
            The Direct seller shall keep proper book of accounts stating the
            details in respect of the goods sold by him/ her, in such form as
            per applicable law.
          </li>
          <li>
            The direct seller shall not:
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>Use misleading, deceptive, and/or unfair trade practices.</li>
              <li>
                Use misleading, false, deceptive, and/or unfair recruiting
                practices, including misrepresentation of actual or potential
                sales or earnings and advantages of direct selling to any
                prospective direct seller in their interaction with prospective
                direct sellers.
              </li>
              <li>
                Make any factual representation to prospective direct sellers
                that cannot be verified or make any promise that cannot be
                fulfilled.
              </li>
              <li>
                Present any advantages of direct selling to any prospective
                direct seller in a false and/or a deceptive manner.
              </li>
              <li>
                Knowingly make, omit, engage, or cause or permit to be made any
                representation relating to the direct selling operation,
                including the remuneration system and agreement between the
                direct selling entity and the direct seller, or the goods, in a
                misleading manner.
              </li>
              <li>
                Require or encourage direct sellers recruited by the first
                mentioned direct seller to purchase goods and/or services in
                unreasonably large amounts.
              </li>
              <li>
                Provide any literature and/or training entity to a prospective
                and/or existing direct seller both within and outside the parent
                direct selling entity.
              </li>
              <li>
                Require prospective or existing direct sellers to purchase any
                literature or training material or sales demonstration
                equipment.
              </li>
            </ul>
          </li>
          <li>
            The company shall provide monetary and non-monetary sales
            benefit/incentive including service tax/GST. The company shall not
            pay any service tax /GST to the Direct seller. The Direct seller
            shall be responsible to pay any service tax /GST (if any).
          </li>
          <li>
            The Direct seller shall not create any cross line in the sales
            Network of the company.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-6">
          Obligations of Direct Seller Entity/Company towards Direct seller
        </h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That the company shall provide a mandatory orientation session to
            all prospective direct sellers providing fair and accurate
            information on all aspect of the direct selling operation including
            but not limited to the remuneration system and expected remuneration
            for newly recruited direct sellers
          </li>
          <li>
            That the company shall maintain proper records either manual or
            electronic of their business dealing with complete details of their
            goods services terms of contract , price, income plan, details of
            direct sellers ,including but not limited to enrollment, termination
            active status, earning etc.
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                the company shall maintain a "register of direct sellers"
                wherein relevant details of each enrolled direct seller shall be
                updated and maintained.
              </li>
              The details of Direct sellers shall include and not be limited to
              verified proof of address, proof of identity and pan.
            </ul>
          </li>
          <li>
            That the company shall maintain proper and updated website with all
            relevant details of the company, contact information, its
            management, product, product information, product quality
            certificate, price, complete income plan, terms of contract with
            direct seller and complaint redressal mechanism for direct sellers
            and consumers.
          </li>
          <li>
            That the company shall provide to direct seller their periodic
            account/information concerning, as applicable, sales, purchases,
            details of earning, commissions, bonus, and other relevant data, in
            accordance with agreement with direct sellers. All financial dues
            shall be paid and any withholding made in a commercially reasonable
            manner.
          </li>
          <li>
            That the company shall monitor the value of the purchases of all its
            Direct sellers/Distributors on a monthly basis and once the purchase
            value crosses the VAT threshold, the company shall intimate the
            Direct sellers/Distributors to pay the VAT.
          </li>
          <li>
            That the Company shall not compel to a participant/Direct seller to
            purchases goods—
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                for an amount that exceeds an amount for which such goods or
                services can be expected to be sold or resold to consumers.
              </li>
              <li>
                For a quantity of goods or services that exceeds an amount that
                can be expected to be consumed by or sold or resold to
                consumers.
              </li>
            </ul>
          </li>
          <li>
            That the Company shall not
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                Use misleading, deceptive or unfair recruiting practices,
                including misrepresentation of actual or potential sales or
                earnings, in their interaction with prospective or existing
                direct sellers;
              </li>
              <li>
                Make any factual representation to a prospective direct seller
                that cannot be verified or make any promise that cannot be
                fulfilled;
              </li>
              <li>
                Present any advantages of direct selling to any prospective
                direct seller in a false or deceptive manner;
              </li>
              <li>
                Make or cause, or permit to be made, any representation relating
                to its
              </li>
            </ul>
          </li>
          <li>
            That the Company shall not
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                Engage in, or cause or permit, any conduct that is misleading or
                likely to mislead with regard to any material particulars
                relating to its direct selling business, including remuneration
                system and agreement between itself and the direct seller, or to
                the goods or services being sold by itself or by the direct
                seller;
              </li>
              <li>
                Use, or cause or permit to be used, fraud, coercion, harassment,
                or unconscionable or unlawful means in promoting its direct
                selling practice, including remuneration system and agreement
                between itself and the direct seller, or the goods or services
                being sold by itself or by the direct seller.
              </li>
              <li>
                Require its direct sellers to provide any benefit, including
                entry fees and renewal fees or to purchase any sales
                demonstration equipment or material in order to participate in
                its direct selling operations;
              </li>
              <li>
                Provide any benefit to any person for the introduction or
                recruitment of one or more persons as direct sellers;
              </li>
              <li>
                Require the direct sellers to pay any money by way of minimum
                monthly subscription or renewal charges;
              </li>
            </ul>
          </li>
          <li>
            That the company shall be responsible for compliance of these
            Guidelines by any member of its network of direct selling, whether
            such member is appointed directly or indirectly by the Direct
            Selling Entity.
          </li>
        </ul>
        <h2 className="font-semibold mt-4">
          Obligations of Direct Seller Entity/Company towards consumer
        </h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That the Company shall provide information to the consumer upon
            purchase which shall contain.
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>The name of the purchaser and seller.</li>
              <li>The delivery date of goods or services</li>
              <li>Procedures for returning the goods; and</li>
              <li>
                Warranty of goods and exchange/replacement of goods in case of
                defect
              </li>
            </ul>
          </li>
          <li>
            Provided that no Direct seller shall, in pursuance of a sale, make
            any claim that is not consistent with claims authorized by the
            Direct seller entity.
          </li>
          <li>
            That the company and Direct seller shall take appropriate steps to
            ensure the protection of all private information provided by a
            consumer.
          </li>
          <li>
            That Direct seller and company shall be guided by the provision of
            the Consumer Protection Act 1986.
          </li>
          <li>
            That the supply/Distribution of goods with the knowledge that such
            goods/products are inferior or exceeded its validity period as per
            the manufacturer is prohibited.
          </li>
          <li>That the MRP should be visibly displayed on the package.</li>
          <li>
            That the company/Direct seller who sells goods to a consumer shall
            issue a cash bill to such consumer in accordance with the provision
            of the law for the time being in force in this respect.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">PROHIBITIONS</h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That any payment of Incentive by whatever names it is called
            unrelated to their respective sales volume is prohibited.
          </li>
          <li>
            That the Direct Seller or his/her relatives (relative means
            dependent son or daughter, father/mother, spouse) shall not engage
            in any activities of Multi Level Marketing of any other entity. If
            it is found then such Direct Seller shall be terminated.
          </li>
          <li>
            That the Direct Seller is prohibited from listing, marketing,
            advertising, promoting, discussing, or selling any product, or the
            business opportunity on any website or online forum that offers like
            auction as a mode of selling.
          </li>
          <li>
            That the Direct Seller hereby undertakes not to compel or induce or
            mislead any person with any false statement/promise to purchase
            products from the Company or to become Direct Seller of the Company.
          </li>
          <li>
            That the Direct Seller and the company hereby undertakes not to
            indulge in money circulation scheme or any act barred by the Prize
            Chits and Money Circulation Scheme (Banning) Act, 1978.
          </li>
          <li>
            That the Company/Direct seller shall not promote a pyramid scheme,
            as defined in Clause 1(12) of the "Advisory to state
            Government/Union territories on Model Guideline on Direct selling"
            issued by the Department of Consumer Affairs, Ministry of Consumer
            Affairs, Food & Public Distribution, Government of India Dt. 09th
            Sep. 2016 F.NO. 21/18/2014-IT(Vol-II), in the garb of Direct selling
            Business opportunities.
          </li>
        </ul>
        <h2 className="font-semibold mt-4">Indemnification</h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That the Direct Seller agrees to protect, defend, indemnify and hold
            harmless Company and its employees, officers, directors, agents or
            representatives from and against any and all liabilities, damages,
            fines, penalties and costs (including legal costs and disbursements)
            arising from or relating to:
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                Any breach of any statute, regulation, direction, orders or
                standards from any governmental body, agency, or regulator
                applicable to the company; or
              </li>
              <li>
                Any breach of the terms and conditions in this agreement by the
                Direct Seller; or
              </li>
              <li>
                Any claim of any infringement of any intellectual property right
                or any other right of any third party or of law by the Direct
                seller; or
              </li>
              <li>
                Against all matters of embezzlement, misappropriation or
                misapplications of collection/moneys which may from time to time
                during the continuance of the Agreement come into his/her/its
                possession/control.
              </li>
            </ul>
          </li>
          <li>
            That this clause shall survive the termination or expiry of this
            Agreement.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">Relationship</h2>

        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That the Direct seller understands that it is an independently owned
            business entity and this Agreement does not make it, its employees,
            associates or agents as employees, agents or legal representatives
            of the company for any purpose whatsoever. The Direct seller has not
            express or implied right or authority to assume or to undertake any
            obligation in respect of or on behalf of or in the name of the
            company or to bind the company in any manner. In case, the Direct
            Seller, its employees, associates or agents hold out as employees,
          </li>
          <li>
            agents, or legal representatives of the company, the company shall
            demand to pay cost of any/all loss, cost, damage including
            consequential loss, suffered by the Direct seller on this account.
          </li>
        </ul>

        <h2 className="font-semibold mt-4">Liability</h2>

        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That except as provided in this Agreement, herein above, the company
            shall not be liable to the Direct seller or any other party by
            virtue of termination of this Agreement for any reason whatsoever
            for any claim for loss or profit or on account for any expenditure,
            investment, leases, capital investments or any other commitments
            made by the other party in connection with the business made in
            reliance upon or by virtue of this Agreement.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">
          Suspension, Revocation or Termination of agreement
        </h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That the company reserves the right to suspend the operation of this
            agreement, at any time, due to change in its own license conditions
            or upon directions from the competent government authorities. In
            such a situation, company shall not be responsible for any damage or
            loss caused or arisen out of aforesaid action.
          </li>
          <li>
            That the company may, without prejudice to any other remedy
            available for the breach of any conditions of agreement, by a
            written notice of ONE month issued to the Direct seller at its
            residential address, terminate this agreement under any of the
            following circumstances:
            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-2">
              <li>
                The Direct Seller failing to perform any obligation(s) under the
                agreement;
              </li>
              <li>
                The Direct Seller failing to rectify, within the time
                prescribed, any defect as may be pointed out by Company.
              </li>
              <li>The Direct Seller becoming insolvent/bankrupt.</li>
              <li>
                The Direct Seller being involved in any criminal
                proceedings/case
                <p>
                  like Pursuant to the provision to the marketing plan, For re
                  ason of non-performance, Any unethical and pre judicial work
                  to the interest of the Company, For the breach of any terms
                  and conditions of this agreement and marketing plan,
                  Information given by Direct Seller found wrong/false, In
                  convicted of an offence punishable by a prison term, Is
                  declared bankrupt, Is not mentally sound to handle the
                  business, Migrate to other country, due to
                  death/insolvency/mentally of Direct seller.But In case of
                  Death, on producing of probate/succession certificate by legal
                  heirs, the Direct seller code may be transferred to the legal
                  heirs of deceased Direct seller
                </p>
              </li>
              <li>
                Where a direct seller is found to have made no sales for goods
                for a period of up to two years since the contract was entered
                into, or since the date of last sale made by the direct seller.
              </li>
              <li>
                Where a direct seller is found to have embezzlement of
                cash/cheque/DD, which is received by the customer on behalf of
                the company.
              </li>
            </ul>
          </li>
          <li>
            That the Direct Seller may terminate this agreement at any time by
            giving a written notice of ONE MONTH to the Company at the
            registered address of the company
          </li>
          <li>
            That It shall be the responsibility of the Direct Seller to maintain
            the agreed Quality of Service, even during the period when the
            notice for surrender/termination of agreement is pending.
          </li>
          <li>
            That Breach of non-fulfillment of Agreement conditions may come to
            the notice of the company through complaints or as a result of the
            regular monitoring. Wherever considered appropriate the company may
            conduct an inquiry either suo-moto or on complaint to determine
            whether there has been any breach in compliance of the terms and
            conditions of the agreement by the Direct Seller or not. The Direct
            Seller shall extend all reasonable facilities and shall endeavor to
            remove the hindrance of every type upon such inquiry.
          </li>
          <li>
            That old agreement of the Direct seller shall not be effective since
            the date of the execution of this new Agreement .
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">
          Actions pursuant to Termination of Agreement
        </h2>
        <p>
          That notwithstanding any other rights and remedies provided elsewhere
          in the agreement, upon termination of this agreement:
        </p>
        <ul className="list-none list-inside pl-6 mt-2 space-y-2">
          <li>
            (a) The Direct seller shall not represent the company in any of its
            dealings
          </li>
          <li>
            (b) The Direct seller shall not intentionally or otherwise commit
            any act(s) as would keep a third party to believe that the company
            is still having Direct selling agreement with Direct seller.
          </li>
          <li>
            (c) The Direct seller shall stop using the company's name,
            trademark, logo, etc., in any audio or visual form.
          </li>
          <li>
            (d) The expiration or termination of the Agreement for any reason
            whatsoever shall not affect any obligation of Direct seller having
            accrued under the Agreement prior to the expiration of termination
            of the Agreement and such expiration or termination shall be without
            prejudice to any liabilities of Direct seller to the company
            existing at the date of expiration or termination of the Agreement.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">Governing Laws and Regulation</h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That this Agreements shall be governed by the Indian Contract, 1872,
            The consumer Protection Act, 1986, "Advisory to state
            Government/Union territories on Model Guideline on Direct selling"
            issued by the Department of consumer Affairs, Ministry of Consumer
            Affairs, Food & Public Distribution, Government of India Dt. 09th
            Sep. 2016 F.NO. 21/18/2014-IT(Vol-II). laws, Rules, regulation and
            Direction issued by the Central and State Government of India and
            any proceedings arising out of this Agreements shall be initiated in
            the appropriate Indian court and all orders and decrees would be
            expressed in Indian language .
          </li>
          <li>
            That the parties hereby agree that nothing contained herein shall
            prejudice the right of the company to appoint another Direct seller
            in the same territory or to open retail outlets if found necessary.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">Cancellation clause</h2>
        <ul>
          <li>
            That notwithstanding anything stated or provided herein, the Company
            shall have full powers and discretion to modify, alter or vary the
            terms and condition in any manner whatsoever they think fit and
            shall be communicated through official website or other mode as the
            Company may deem fit and proper. If any • Direct Seller does not
            agree to be bound by such amendment, he/she may terminate this
            agreement within 30 days of such publication by giving a written
            notice to the Company. Without submission of the objection for
            modification etc., if Direct Seller continues the Direct Selling
            activities then it will be deemed that he/she has accepted all
            modifications and amendments in the terms & conditions for future.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">Dispute Settlement</h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That In the event of any question, dispute or difference arising
            under this agreement or in connection there-with (except as to the
            matters, the decision to which is specifically provided under this
            agreement), the same shall be referred to the court of Delhi
            (Delhi).
          </li>
          <li>
            That the parties hereby agree that any dispute or difference between
            them may be referred to the arbitrator whose decision shall be final
            and binding upon the parties hereto.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">Force- Majeure</h2>
        <ul>
          <li>
            That If at any time, during the continuance of this agreement, the
            performance in whole or in part, by the company, of any obligation
            under this is prevented or delayed, by reason of war, or hostility,
            acts of the public enemy, civic commotion, sabotage, Act of State or
            direction from Statutory Authority, explosion, epidemic, quarantine
            restriction, strikes and lockouts, fire, floods, natural calamities
            or any act of God (hereinafter referred to as event), neither party
            shall, by reason of such event, be entitled to terminate the
            agreement, nor shall either party have any such claims for damages
            against the other, in respect of such non-performance or delay in
            performance. Provided Service under the agreement shall be resumed
            as soon as practicable, after such event comes to an end or ceases
            to exist.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mt-4">
          The Direct seller hereby covenants that as under :
        </h2>
        <ul className="list-decimal list-inside pl-6 mt-2 space-y-2">
          <li>
            That he/she has clearly understood the application form, marketing
            methods/plan, the compensation plan, its limitations and conditions
            and he/she is not relying upon any representation or promises that
            is not set out in these terms and conditions or other official
            printed or published materials of the Company.
          </li>
          <li>
            That Relation between the Company and the Direct Seller and all
            his/her activities here under shall be governed in addition to this
            agreement, by the rules/procedure contained in the marketing plan,
            available on website. The Direct Seller confirms that he/she has
            read out all the terms & conditions thereof and agrees to be bound
            by them.
          </li>
          <li>
            Shall act as a freelance body and shall not commit any misfeasance
            or malfeasance to create any liability/obligation over the Company
            of whatsoever nature.
          </li>
          <li>
            That the Direct Seller is not an agent, Employee or any other Legal
            representative of the Company or its service providers.
          </li>
          <li>
            That Any payment received by the Direct Seller from any person
            declaring that the amount is being received for and on behalf of the
            Company shall not be deemed to be received by the Company. Direct
            seller is not authorized to receive any money for and on behalf of
            the Company.
          </li>
          <li>
            That Direct Seller, hereby declare that all the information
            furnished to the Company are true and correct. Company shall be at
            sole discretion and liberty to take any action against the Direct
            Seller in the event, it is discovered that the Direct Seller
            furnished any wrong/false information to the Company.
          </li>
          <li>
            That I am the concerned person hence fully conversant with the fact
            deposed above and I have agreed without any pressure to be appointed
            as Direct Seller in whole India on terms and condition as contained
            in this agreement.
          </li>
          <li>
            That I have read and understood the terms and conditions for
            appointment of Direct Seller of the Company and I have also gone
            through the Company's official website, printed materials, brochures
            and convinced about the business and I have applied to appoint me as
            a Direct Seller on my own volition.
          </li>
          <li>
            I undertake to adhere for policies, procedures, rules and
            regulations formed by the Company and I confirm having read/been
            explained and understood the contents of the document on policy and
            procedures of the appointment of Direct Seller.
          </li>
        </ul>
      </div>
      <div className="mt-8 text-sm">
        <p className="text-center font-semibold mb-6">
          IN WITNESS WHEREOF the parties hereto have caused this Agreement to be
          executed through their respective authorized representatives on the
          19/02/2025
        </p>

        <p className="mb-6">
          Read over by me/ to me and agreed by me on (Date) .{new Date(data?.createdAt).toLocaleDateString('en-GB')}
        </p>

        <div className="flex justify-between mb-8">
          <div>
            <p className="mb-1">
              Name: <span className="underline">{data?.name}</span>
            </p>
            <p>
              Signature:{" "}
              <span className="inline-block w-40 border-b-2 border-black"></span>
            </p>
          </div>

        </div>

        <div className="flex justify-between mb-10">
          <div>
            <p>Sign and seal of the company...</p>
          </div>
          <div>
            <Image
              width={150}
              height={150}
              alt=''
              src="/images/homepage/Screenshot 2025-04-19 151921.png"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Witnesses:</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                Name{" "}
                <span className="inline-block w-40 border-b-2 border-black"></span>
              </p>
              <p className="mt-4">
                Signature{" "}
                <span className="inline-block w-40 border-b-2 border-black"></span>
              </p>
            </div>
            <div>
              <p>
                Name{" "}
                <span className="inline-block w-40 border-b-2 border-black"></span>
              </p>
              <p className="mt-4">
                Signature{" "}
                <span className="inline-block w-40 border-b-2 border-black"></span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs italic">
          <p>Signature of applicant on each and every page is mandatory.</p>
          <p>All Documents must be Self Attested</p>
        </div>
      </div>
    </div>
  );
}
