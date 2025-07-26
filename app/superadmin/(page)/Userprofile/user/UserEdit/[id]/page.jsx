"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const { id } = useParams();
  const email = decodeURIComponent(id);
  const [saosp, setSaosp] = useState(0);
  const [sgosp, setSgosp] = useState(0);
  const [userData, setUserData] = useState(null);
  const [userDs, setUserDs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    kycVerified: false,
    levelName: "",
    sao: "",
    sgo: "",
    usertype: "",
    status: "",
    spAddType: "",     // SAO or SGO (for addition)
    spAddAmount: "",   // Add amount

    spRemoveType: "",  // SAO or SGO (for subtraction)
    spRemoveAmount: "" // Remove amount

  });
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user/find-admin-byemail/${email}`);
      setUserData(res.data);
      setUserDs(res.data.dscode);
      setFormData((prev) => ({
        ...prev,
        kycVerified: res.data?.kycVerification?.isVerified || false,
        usertype: res.data?.usertype,
        status: res.data?.status
      }));
    } catch (err) {
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Data
  useEffect(() => {
    fetchUser();
  }, [email]);

  useEffect(() => {
    axios
      .get("/api/level/fetch/level")
      .then((res) => setLevels(res.data.data || []))
      .catch(() => setError("Failed to fetch levels."));
  }, []);

  useEffect(() => {
    if (!userDs) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch both APIs simultaneously
        const [teamResponse] = await Promise.all([
          axios.get(`/api/dashboard/teamsp/${userDs}`),
        ]);

        setSaosp(parseFloat(teamResponse.data.totalSaoSP || 0));
        setSgosp(parseFloat(teamResponse.data.totalSgoSP || 0));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDs]);


  // Handle Level Change
  const handleLevelChange = (value) => {
    const selected = levels.find((level) => level.level_name === value);
    setFormData({
      ...formData,
      levelName: value,
      sao: selected?.sao || "",
      sgo: selected?.sgo || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updateData = {
        id: userData._id,
        kycVerification: {
          isVerified: formData.kycVerified,
        },
        usertype: formData.usertype === "100sp" ? "1" : formData.usertype,
        status: formData.status
      };

      if (formData.usertype === "100sp") {
        updateData.activesp = "100";
      }

      const paymentRequests = [];

      // LEVEL LOGIC
      if (formData.levelName) {
        const levelExists = userData?.LevelDetails?.some(
          (lvl) => lvl.levelName === formData.levelName
        );

        if (levelExists) {
          toast.error("This level has already been assigned to the user.");
          setLoading(false);
          return;
        }

        const selectedLevel = levels.find((lvl) => lvl.level_name === formData.levelName);
        const currentDate = new Date().toLocaleDateString("en-GB");

        const newLevelEntry = {
          levelName: formData.levelName,
          sao: userData?.saosp || "",
          sgo: userData?.sgosp || "",
        };

        const updatedLevelDetails = [...(userData.LevelDetails || []), newLevelEntry];

        const newWalletEntry = {
          salecommission: "",
          salesgrowth: selectedLevel?.bonus_income?.toString() || "0",
          date: currentDate,
        };

        if (userData.activesp === "100") {
          newWalletEntry.performance = selectedLevel?.performance_income?.toString() || "";
        }

        const updatedWalletDetails = [...(userData.WalletDetails || []), newWalletEntry];

        updateData.LevelDetails = updatedLevelDetails;
        updateData.WalletDetails = updatedWalletDetails;
        updateData.level = formData.levelName;

        const paymentPayload = {
          dsid: userData.dscode,
          group: userData.group || "",
          levelname: formData.levelName,
          type: "level update",
          amount: "0",
          bonus_income: selectedLevel?.bonus_income?.toString() || "0",
          sp: "0",
          orderno: "",
          referencename: ""
        };

        if (userData.activesp === "100") {
          paymentPayload.performance_income = selectedLevel?.performance_income?.toString() || "0";
        }

        paymentRequests.push(() => axios.post("/api/PaymentHistory/add", paymentPayload));
      }

      // ADD SP
      if (formData.spAddType && formData.spAddAmount) {
        const currentSp = parseFloat(formData.spAddType === "SAO" ? userData.saosp || 0 : userData.sgosp || 0);
        const addAmount = parseFloat(formData.spAddAmount);
        if (isNaN(addAmount) || addAmount < 0) {
          toast.error("Add SP amount must be a valid positive number.");
          setLoading(false);
          return;
        }

        const newSp = (currentSp + addAmount).toString();
        updateData[formData.spAddType === "SAO" ? "saosp" : "sgosp"] = newSp;

        paymentRequests.push(() =>
          axios.post("/api/PaymentHistory/add", {
            dsid: userData.dscode,
            amount: "0",
            sp: addAmount.toString(),
            group: formData.spAddType || "",
            type: "superadmin gift sp",
            orderno: "",
            levelname: "",
            referencename: ""
          })
        );
      }

      // REMOVE SP
      if (formData.spRemoveType && formData.spRemoveAmount) {
        const currentSp = parseFloat(formData.spRemoveType === "SAO" ? userData.saosp || 0 : userData.sgosp || 0);
        const removeAmount = parseFloat(formData.spRemoveAmount);
        if (isNaN(removeAmount) || removeAmount < 0) {
          toast.error("Remove SP amount must be a valid positive number.");
          setLoading(false);
          return;
        }
        if (currentSp - removeAmount < 0) {
          toast.error("Cannot remove more SP than currently available.");
          setLoading(false);
          return;
        }

        const newSp = (currentSp - removeAmount).toString();
        updateData[formData.spRemoveType === "SAO" ? "saosp" : "sgosp"] = newSp;

        paymentRequests.push(() =>
          axios.post("/api/PaymentHistory/add", {
            dsid: userData.dscode,
            amount: "0",
            sp: `-${removeAmount.toString()}`,
            group: userData.group || "",
            type: "superadmin remove sp",
            orderno: "",
            levelname: "",
            referencename: ""
          })
        );
      }

      // ✅ USER UPDATE FIRST
      await axios.patch("/api/user/update/", updateData);

      // ✅ THEN ALL PAYMENT HISTORY CALLS
      for (const post of paymentRequests) {
        await post();
      }

      toast.success("User updated successfully!");
      window.location.reload();
      setFormData((prev) => ({
        ...prev,
        levelName: "",
        sao: "",
        sgo: "",
        spAddType: "",
        spAddAmount: "",
        spRemoveType: "",
        spRemoveAmount: ""
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const filteredLevels = (() => {
    const sortedLevels = [...levels].sort((a, b) => parseInt(a.sao) - parseInt(b.sao));

    let cumulativeSao = 0;
    let cumulativeSgo = 0;
    let userCurrentLevelIndex = -1;

    // Find current user level index based on LevelDetails (assumes latest one is current)
    const currentLevelName = userData?.LevelDetails?.slice(-1)[0]?.levelName;

    // Identify index of current level in sortedLevels
    sortedLevels.forEach((lvl, index) => {
      if (lvl.level_name === currentLevelName) {
        userCurrentLevelIndex = index;
      }
    });

    // Calculate next level's index
    const nextLevelIndex = userCurrentLevelIndex + 1;

    let result = [];

    for (let i = 0; i <= nextLevelIndex; i++) {
      cumulativeSao += parseInt(sortedLevels[i]?.sao || 0);
      cumulativeSgo += parseInt(sortedLevels[i]?.sgo || 0);
    }

    const nextLevel = sortedLevels[nextLevelIndex];

    if (
      nextLevel &&
      parseInt(saosp || 0) >= cumulativeSao &&
      parseInt(sgosp || 0) >= cumulativeSgo
    ) {
      result.push(nextLevel); // Only return next eligible level
    }

    return result;
  })();


  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Update User</h2>

      {/* Current Info Card */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <p className="font-semibold">
          Current Level: <span className="text-blue-600">{userData?.level || "N/A"}</span>
        </p>
        

        <p>
          SAO Score: <span className="text-green-600 font-semibold">{saosp || 0}</span>
        </p>
        <p>
          SGO Score: <span className="text-purple-600 font-semibold">{sgosp || 0}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-4 rounded shadow">
        {/* KYC Verification */}
        {/* <div>
          <label className="block mb-1 font-medium">KYC Verified</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.kycVerified}
            onChange={(e) =>
              setFormData({ ...formData, kycVerified: e.target.value === "true" })
            }
          >
            <option value="false">Not Verified</option>
            <option value="true">Verified</option>
          </select>
        </div> */}


        <div>
          <label className="block mb-1 font-medium">Allow User to Edit Self Details Or Active after 1 Month</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="0">Don't Allow</option>
            <option value="1">Allow To Edit Self Details</option>
            <option value="2">Allow To Activate self</option>
          </select>
        </div>


        {userData?.usertype === "0" && (
          <div>
            <label className="block mb-1 font-medium">Active User Without Sp</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.usertype}
              onChange={(e) =>
                setFormData({ ...formData, usertype: e.target.value })
              }
            >
              <option value="">-- Select User Type --</option>
              <option value="1">Activate as 'User Without SP'</option>
              <option value="100sp">Activate as '100 sp'</option>
            </select>
          </div>
        )}
        {/* Eligible Levels */}
        <div>
          <label className="block mb-1 font-medium">Eligible Levels (Optional)</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.levelName}
            onChange={(e) => handleLevelChange(e.target.value)}
          >
            <option value="">Select Level</option>
            {filteredLevels.map((level) => (
              <option key={level._id} value={level.level_name}>
                {level.level_name} (SAO: {level.sao}, SGO: {level.sgo})
              </option>
            ))}
          </select>
        </div>

        {/* Add SP */}
        <div>
          <label className="block mb-1 font-medium">Add SP (Optional)</label>
          <div className="flex gap-4">
            <select
              className="w-1/2 p-2 border rounded"
              value={formData.spAddType}
              onChange={(e) => setFormData({ ...formData, spAddType: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="SAO">SAO</option>
              <option value="SGO">SGO</option>
            </select>
            <input
              type="number"
              className="w-1/2 p-2 border rounded"
              value={formData.spAddAmount}
              onChange={(e) => setFormData({ ...formData, spAddAmount: e.target.value })}
              placeholder="Enter SP amount"
              min="0"
            />
          </div>
        </div>

        {/* Remove SP */}
        <div>
          <label className="block mb-1 font-medium">Remove SP (Optional)</label>
          <div className="flex gap-4">
            <select
              className="w-1/2 p-2 border rounded"
              value={formData.spRemoveType}
              onChange={(e) => setFormData({ ...formData, spRemoveType: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="SAO">SAO</option>
              <option value="SGO">SGO</option>
            </select>
            <input
              type="number"
              className="w-1/2 p-2 border rounded"
              value={formData.spRemoveAmount}
              onChange={(e) => setFormData({ ...formData, spRemoveAmount: e.target.value })}
              placeholder="Enter SP amount"
              min="0"
            />
          </div>
        </div>



        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>

      <Toaster />
    </div>
  );
}