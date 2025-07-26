'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, Users, Briefcase, ChevronRight, Share2 } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// --- Tree View Styles ---
// Using a style tag for complex pseudo-element selectors needed for tree lines,
// which are difficult to achieve with Tailwind alone.
const TreeStyles = () => (
  <style jsx global>{`
    .tree-container {
      width: 100%;
      overflow-x: auto;
      padding: 1rem;
    }
    .tree {
      display: inline-block;
      min-width: 100%;
      text-align: center;
    }
    .tree ul {
      position: relative;
      padding-top: 20px;
      transition: all 0.5s;
      display: flex;
      justify-content: center;
    }
    .tree li {
      float: left;
      text-align: center;
      list-style-type: none;
      position: relative;
      padding: 20px 5px 0 5px;
      transition: all 0.5s;
    }
    /* Connector lines for desktop */
    .tree li::before, .tree li::after {
      content: '';
      position: absolute;
      top: 0;
      right: 50%;
      border-top: 2px solid #e2e8f0; /* gray-200 */
      width: 50%;
      height: 20px;
    }
    .tree li::after {
      right: auto;
      left: 50%;
      border-left: 2px solid #e2e8f0; /* gray-200 */
    }
    .tree > ul > li::before, .tree > ul > li::after {
      border: 0;
    }
    .tree li:only-child::after, .tree li:only-child::before {
      display: none;
    }
    .tree li:first-child::before, .tree li:last-child::after {
      border: 0 none;
    }
    .tree li:last-child::before {
      border-right: 2px solid #e2e8f0; /* gray-200 */
      border-radius: 0 5px 0 0;
    }
    .tree li:first-child::after {
      border-radius: 5px 0 0 0;
    }
    .tree ul ul::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      border-left: 2px solid #e2e8f0; /* gray-200 */
      width: 0;
      height: 20px;
    }
    .tree li .node-content {
      border: 1px solid #e2e8f0; /* gray-200 */
      padding: 10px;
      text-decoration: none;
      color: #4b5563; /* gray-600 */
      background-color: #fff;
      display: inline-block;
      border-radius: 8px;
      transition: all 0.5s;
      min-width: 150px;
    }
    /* Dark mode styles */
    .dark .tree li::before, .dark .tree li::after, .dark .tree ul ul::before, .dark .tree li:last-child::before, .dark .tree li:first-child::after {
        border-color: #4a5568; /* gray-600 */
    }
    .dark .tree li .node-content {
        border-color: #4a5568; /* gray-600 */
        background-color: #1f2937; /* gray-800 */
        color: #d1d5db; /* gray-300 */
    }

    /* --- Mobile Responsive Styles --- */
    @media (max-width: 768px) {
      .tree-container {
        overflow-x: hidden;
      }
      .tree {
        display: block;
        text-align: left;
      }
      .tree ul {
        display: block;
        padding-top: 0;
        padding-left: 20px;
      }
      .tree > ul {
        padding-left: 0;
      }
      .tree li {
        float: none;
        display: block;
        text-align: left;
        padding: 15px 0 0 0;
      }
      /* Hide desktop connectors */
      .tree li::before, .tree li::after, .tree ul ul::before {
        display: none;
      }
      .tree li .node-content {
        width: 100%;
      }
      /* Create simple vertical connectors for mobile */
      .tree li:not(:last-child) {
        border-left: 2px solid #e2e8f0; /* gray-200 */
      }
      .dark .tree li:not(:last-child) {
        border-color: #4a5568; /* gray-600 */
      }
      .tree ul > li {
        position: relative;
      }
      .tree ul > li::before {
        content: '';
        position: absolute;
        top: 35px; /* Adjust to align with node */
        left: -20px;
        border-top: 2px solid #e2e8f0; /* gray-200 */
        width: 20px;
        height: 0;
        display: block;
      }
      .dark .tree ul > li::before {
        border-color: #4a5568; /* gray-600 */
      }
    }
  `}</style>
);


// --- Skeleton Loader Component ---
const SkeletonLoader = () => (
    <div className="animate-pulse p-4 md:p-8">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-sm h-28 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-center gap-10">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-48 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
               <div className="w-full h-20 bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>
               <div className="w-full h-20 bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
);

// --- User/Member Card Component ---
const UserCard = ({ user, isMainUser = false }) => {
  const cardClasses = isMainUser
    ? 'bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 border-2 border-blue-500'
    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3 hover:shadow-md transition-all duration-300 w-full';
  
  const imageSize = isMainUser ? 60 : 40;
  const iconWrapperSize = isMainUser ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className={cardClasses}>
      <div className="flex items-start space-x-3">
        <div className={`${iconWrapperSize} flex-shrink-0`}>
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={imageSize}
              height={imageSize}
              className="object-cover rounded-full border-2 border-white dark:border-gray-600 shadow-md"
            />
          ) : (
            <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full ${iconWrapperSize}`}>
              <User className="text-gray-400" size={isMainUser ? 30 : 22} />
            </div>
          )}
        </div>
        <div className="flex-1 text-left overflow-hidden">
          <p className={`font-bold ${isMainUser ? 'text-lg' : 'text-base'} text-gray-800 dark:text-white truncate`}>
            {user.name || 'N/A'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || 'No email'}</p>
          {!isMainUser && (
             <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">DS Code:</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full font-mono text-xs">
                    {user.dscode}
                </span>
            </div>
          )}
          {isMainUser && (
             <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p><span className="font-semibold">Mobile:</span> {user.mobileNo || '-'}</p>
                <div className="flex items-center gap-2 pt-1">
                    <span className="font-semibold">DS Code:</span>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full font-mono">
                        {user.dscode}
                    </span>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Tree Node Component ---
const TreeNode = ({ user, title, onSearch, children, isRoot = false, isGroupNode = false }) => {
  const nodeContent = isGroupNode ? (
    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner flex items-center">
      <Share2 className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
      <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <UserCard user={user} isMainUser={isRoot} />
      </div>
      {!isRoot && (
        <button
          onClick={() => onSearch(user.dscode)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 transition-colors flex-shrink-0"
          title={`Search for ${user.dscode}`}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );

  return (
    <li>
      <div className="node-content p-2 bg-transparent border-none md:w-[320px]">{nodeContent}</div>
      {children && React.Children.count(children) > 0 && <ul>{children}</ul>}
    </li>
  );
};

// --- Main Page Component ---
export default function Page() {
  const { data: session } = useSession();
  const [usertype, setUsertype] = useState(null);
  const [dscode, setDscode] = useState(null);
  const [dsId, setDsId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        if (response.data) {
          const userData = response.data;
          setUsertype(userData.usertype);
          setDscode(userData.dscode);
          setDsId(userData.dscode);
          handleSearch(userData.dscode, userData.usertype, userData.dscode);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Could not load initial user data.');
      }
    };
    fetchUserData();
  }, [session?.user?.email]);

  const handleSearch = async (customDsId, customUserType, customDsCode) => {
    const idToSearch = customDsId ?? dsId;
    if (!idToSearch.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await axios.get(`/api/dscode/findtwobydscode/${idToSearch}`, {
        params: { usertype: customUserType ?? usertype, dscode: customDsCode ?? dscode },
      });
      if (response.data.success) {
        setSearchResult({
          user: response.data.mainUser,
          members: response.data.relatedUsers,
        });
      } else {
        setError('No user found with this D.S. ID.');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMemberSearch = (memberDsCode) => {
    setDsId(memberDsCode);
    handleSearch(memberDsCode);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const groupedMembers = searchResult?.members.reduce((acc, member) => {
    const group = member.group || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(member);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TreeStyles />
      <div className="max-w-full mx-auto">
        <div className="sticky top-0 z-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white flex items-center"><Briefcase className="mr-2 h-5 w-5 text-blue-500"/>Search D.S. Network</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={dsId || ''}
                onChange={(e) => setDsId(e.target.value)}
                placeholder="Enter D.S. ID..."
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-wait flex-shrink-0"
              >
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="tree-container">
            {loading && <SkeletonLoader />}
            {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</p>}
            
            {searchResult && (
                <div className="tree">
                    <ul>
                        <TreeNode user={searchResult.user} isRoot={true}>
                            {groupedMembers && Object.entries(groupedMembers).map(([groupName, members]) => (
                                <TreeNode key={groupName} title={`Group: ${groupName}`} isGroupNode={true}>
                                    {members.map(member => (
                                        <TreeNode key={member.id || member.dscode} user={member} onSearch={handleMemberSearch} />
                                    ))}
                                </TreeNode>
                            ))}
                        </TreeNode>
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
