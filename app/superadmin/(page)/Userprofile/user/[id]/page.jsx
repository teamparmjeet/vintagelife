"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Order from "@/components/Order/Order";
import UserVerify from "@/components/UserVerify/UserVerify";
import Link from "next/link";
export default function UserProfile() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userds, setUserds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [panelData, setPanelData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/user/find-admin-byemail/${decodedId}`
        );
        setUserData(response.data);
        setUserds(response.data.dscode);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedId]);



    useEffect(() => {
      if (!userds) {
        // If there's no session info yet, we are still technically "loading" or waiting.
        // Setting loading to false here would show an empty screen.
        return;
      }

      const fetchPanelData = async () => {
        try {
          // Fetch data concurrently for speed
          const [panelResponse] = await Promise.all([
            axios.get(`/api/userpanel/${userds}`),
          ]);
          setPanelData(panelResponse.data);
          console.log(panelResponse.data)
        } catch (error) {
          console.error("Error fetching panel data:", error);
          // Optionally, set an error state here to show an error message
        } finally {
          setLoading(false);
        }
      };

      fetchPanelData();
    }, [userds]);


    const handleDelete = async () => {
      if (!decodedId) return;

      const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      setLoading(true);
      try {
        await axios.delete(`/api/user/delete/${decodedId}`);
        setSuccess("User deleted successfully.");
        await axios.delete(`/api/kyc/delete/${userData.dscode}`);
        // Redirect after deletion
        setTimeout(() => {
          router.push("/superadmin/Userprofile/user"); // Redirect after deletion
        }, 1500);
      } catch (error) {
        console.error("Delete error:", error);
        setError("Failed to delete user.");
      } finally {
        setLoading(false);
      }
    };
    const handleFreeze = async () => {
      if (!decodedId || !userData) return;

      const isFrozen = userData.defaultdata === "freeze";

      const confirmAction = confirm(
        isFrozen ? "Unfreeze this account?" : "Freeze this account?"
      );
      if (!confirmAction) return;

      setLoading(true);
      try {
        const updateData = {
          id: userData._id, // ✅ include ID in the body
          defaultdata: isFrozen ? "user" : "freeze",
        };

        await axios.patch("/api/user/update", updateData); // ✅ no id in URL
        setSuccess(`Account ${isFrozen ? "unfrozen" : "frozen"} successfully.`);
        window.location.reload();

      } catch (error) {
        console.error("Freeze error:", error);
        setError("Failed to update freeze status.");
      } finally {
        setLoading(false);
      }
    };

    const handleBlock = async () => {
      if (!decodedId || !userData) return;

      const isBlocked = userData.defaultdata === "block";

      const confirmAction = confirm(
        isBlocked ? "Unblock this account?" : "Block this account?"
      );
      if (!confirmAction) return;

      setLoading(true);
      try {
        const updateData = {
          id: userData._id, // ✅ include ID here as well
          defaultdata: isBlocked ? "user" : "block",
        };

        await axios.patch("/api/user/update", updateData);
        setSuccess(`Account ${isBlocked ? "unblocked" : "blocked"} successfully.`);
        window.location.reload();
      } catch (error) {
        console.error("Block error:", error);
        setError("Failed to update block status.");
      } finally {
        setLoading(false);
      }
    };




    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg font-semibold animate-pulse">Loading...</div>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 font-semibold">{error}</p>;
    }

    if (!userData) {
      return <p className="text-center text-gray-500">No user data available.</p>;
    }

    return (
      <div className=" mx-auto p-1 lg:p-2 bg-white dark:bg-gray-800 dark:shadow-none dark:border shadow-lg rounded-lg mt-6">
        {success && (
          <p className="text-center text-green-500 font-semibold">{success}</p>
        )}
        <div className="flex flex-wrap items-center gap-6 border-b pb-6 mb-6">
          {/* Profile Image */}
          <div className="flex justify-center items-center w-full lg:w-auto">
            <Image
              src={userData.image || "/images/user/icon-5359553_640.webp"}
              alt="Profile"
              width={200}
              height={200}
              className="w-28 h-28 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover shadow-lg"
            />
          </div>

          {/* User Info */}
         <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
  {/* Header: Name and Role Info */}
  <div className="mb-6 text-center xl:text-left">
  <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
    {userData?.name || "Unknown"}
  </h4>

  <div className="flex flex-wrap justify-center xl:justify-start gap-3">
    <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-4 py-2 rounded-xl font-semibold shadow text-sm">
      SAO Id: <span className="font-bold">{panelData?.totalSAO}</span>
    </div>

    <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-4 py-2 rounded-xl font-semibold shadow text-sm">
      SGO Id: <span className="font-bold">{panelData?.totalSGO}</span>
    </div>
  </div>
</div>


  {/* Grid Details */}
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xl:grid-cols-4 text-sm">
    <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-xl font-medium shadow text-center">
      DsId: {userData?.dscode}
    </div>

    <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-xl font-medium shadow text-center">
      Sponsor Id: {userData?.pdscode}
    </div>

    <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 rounded-xl font-medium shadow text-center">
      User Group: {userData?.group}
    </div>

    <div className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow text-center">
      SAO RP: {userData?.saosp}
    </div>

    <div className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow text-center">
      SGORP: {userData?.sgosp}
    </div>

    <div className="col-span-2 xl:col-span-1 flex justify-center xl:justify-start items-center">
      
      <Link
        href={`./UserEdit/${userData.email}`}
        className="border-blue-700 border rounded p-1  underline font-medium hover:bg-blue-200  text-xs text-blue-800 bg-blue-100"
      >
        Add/Remove Rp , Active After 1 Month
      </Link>
    </div>
     <div className="col-span-2 xl:col-span-1 flex justify-center xl:justify-start items-center">
      
      <Link
        href={`./UserEditdetails/${userData.email}`}
        className="border-blue-700 border rounded p-1  underline font-medium hover:bg-blue-200  text-xs text-blue-800 bg-blue-100"
      >
        Edit User
      </Link>
    </div>
  </div>
</div>

        </div>


        <Order id={userData?.dscode} />

        <Section title="Personal Details">
          <InfoGrid>
            <InfoCard
              label="Father/Husband Name"
              value={userData.fatherOrHusbandName}
            />
            <InfoCard label="Date of Birth" value={formatDate(userData.dob)} />
            <InfoCard label="Profession" value={userData.profession} />
            <InfoCard label="Marital Status" value={userData.maritalStatus} />
            <InfoCard label="Mobile Number" value={userData.mobileNo} />
            <InfoCard label="Whatsapp Number" value={userData.whatsappNo} />
            <InfoCard label="DS Code" value={userData.dscode} />
            <InfoCard label="PDS Code" value={userData.pdscode} />
          </InfoGrid>
        </Section>

        <Section title="Address">
          <InfoGrid>
            <p className="text-gray-600 dark:text-gray-200">
              {userData.address?.addressLine1 || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-200">
              {userData.address?.addressLine2 || "N/A"}
            </p>
          </InfoGrid>
          <p className="text-gray-600 dark:text-gray-200">
            {userData.address?.city}, {userData.address?.state} -{" "}
            {userData.address?.pinCode}
          </p>
        </Section>

        <Section title="KYC Verification">
          <p
            className={`font-semibold ${userData.kycVerification?.isVerified
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {userData.kycVerification?.isVerified
              ? "Verified ✅"
              : "Not Verified ❌"}
          </p>
          <InfoGrid>
            <InfoCard
              label="Proof Type"
              value={userData.kycVerification?.proofType}
            />
            <InfoCard
              label="Document No"
              value={userData.kycVerification?.documentNo}
            />
          </InfoGrid>
        </Section>

        <Section title="Uploaded Documents">
          <InfoGrid4>
            {[
              {
                label: "PAN Card",
                image: userData.panimage,
                value: userData.panno,
              },
              {
                label: "Aadhar Card",
                image: userData.aadharimage,
                value: userData.aadharno,
              },
              {
                label: "Address Proof",
                image: userData.addressproofimage,
                value: userData.addressproofno,
              },
            ].map((doc, index) => (
              <ImageCard
                key={index}
                label={doc.label}
                image={doc.image}
                value={doc.value}
                showValue={true}
              />
            ))}
          </InfoGrid4>
        </Section>

        <Section title="Bank Details">
          <InfoGrid>
            <InfoCard label="Bank Name" value={userData.bankName} />
            <InfoCard label="Account Number" value={userData.acnumber} />
            <InfoCard label="IFSC Code" value={userData.ifscCode} />
            <InfoGrid>
              <ImageCard
                label="Bank Document"
                image={userData.bankimage}
                value={userData.acnumber}
                showValue={false}
              />
            </InfoGrid>
          </InfoGrid>
        </Section>

        <Section title="Nominee Information">
          <InfoGrid>
            <InfoCard label="Nominee Name" value={userData.nomineeName} />
            <InfoCard label="Relation" value={userData.nomineeRelation} />
            <InfoCard
              label="Date of Birth"
              value={formatDate(userData.nomineeDOB)}
            />
            <InfoCard label="Bank Name" value={userData.nomineebankName} />
            <InfoCard label="Account No." value={userData.nomineeacnumber} />
            <InfoCard label="IFSC Code" value={userData.nomineeifscCode} />
            <InfoCard
              label="Nominee Pan Card No."
              value={userData.nomineeipanno}
            />
            <InfoCard
              label="Nominee Aadhar No."
              value={userData.nomineeiaadharno}
            />
          </InfoGrid>
        </Section>

        <Section title="User Status">
          <div className="grid grid-cols-2 gap-4">
            <StatusCard label="User Type" text={getUserType(userData.usertype)} />
          </div>
        </Section>

        <div className="  mt-5 flex  justify-end">

          {decodedId && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleFreeze}
                disabled={loading}
                className={`${userData?.defaultdata === "freeze" ? "bg-green-600" : "bg-yellow-500"
                  } hover:opacity-90 text-sm px-4 py-2 rounded text-white transition duration-200 disabled:opacity-50`}
              >
                {userData?.defaultdata === "freeze" ? "Unfreeze Account" : "Freeze Account"}
              </button>

              <button
                type="button"
                onClick={handleBlock}
                disabled={loading}
                className={`${userData?.defaultdata === "block" ? "bg-green-600" : "bg-orange-600"
                  } hover:opacity-90 text-sm px-4 py-2 rounded text-white transition duration-200 disabled:opacity-50`}
              >
                {userData?.defaultdata === "block" ? "Unblock Account" : "Block Account"}
              </button>

              {/* <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded text-white transition duration-200 disabled:opacity-50"
            >
              Delete Account
            </button> */}
            </div>


          )}
        </div>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 dark:shadow-none dark:border rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoGrid = ({ children }) => (
    <div className="grid grid-cols-2 gap-4 ">{children}</div>
  );
  const InfoGrid4 = ({ children }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">{children}</div>
  );

  const InfoCard = ({ label, value }) => (
    <div>
      <h3 className="font-semibold text-gray-700 dark:text-gray-100">{label}</h3>
      <p className="text-gray-600 dark:text-gray-400">{value || "N/A"}</p>
    </div>
  );

  const ImageCard = ({ label, image, value, showValue = false }) => (
    <div className="">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-300 mb-2">
        {label}
      </h3>
      {image ? (
        <a href={image} target="_blank" rel="noopener noreferrer">
          <Image
            src={image}
            alt={label}
            width={300}
            height={200}
            className="w-full h-42 rounded-md object-cover shadow-md cursor-pointer"
          />
        </a>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No document uploaded</p>
      )}

      {showValue && value && (
        <div className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            <strong>{label} No:</strong> {value}
          </p>
        </div>
      )}
    </div>
  );

  const StatusCard = ({ label, status, text }) => (
    <div>
      <h3 className="font-semibold text-gray-700 dark:text-gray-200">{label}</h3>
      <p
        className={`text-sm font-bold ${status ? "text-green-600" : "text-red-600"
          }`}
      >
        {text || (status ? "Active ✅" : "Inactive ❌")}
      </p>
    </div>
  );

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  const getUserType = (type) => {
    switch (type) {
      case "0":
        return "Regular User";
      case "1":
        return "Admin";
      default:
        return "Super Admin";
    }
  };
