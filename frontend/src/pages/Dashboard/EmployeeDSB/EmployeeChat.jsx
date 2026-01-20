import React, { useState, useEffect, useRef } from "react";
import { chatAPI, userAPI } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import {
    PaperAirplaneIcon,
    FaceSmileIcon,
    PaperClipIcon,
    MicrophoneIcon,
    CheckIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    UsersIcon,
    PhoneIcon,
    VideoCameraIcon,
    ChatBubbleLeftRightIcon,
    PlusIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Assets
const WHATSAPP_BG = "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png";

export default function EmployeeChat() {
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

    // UI State
    const [showNewChatModal, setShowNewChatModal] = useState(false);

    // Restoring missing state
    const [colleagues, setColleagues] = useState([]);
    const [filteredColleagues, setFilteredColleagues] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);

    const scrollRef = useRef(null);

    // --- 1. Init: Load User & Colleagues & Groups ---
    useEffect(() => {
        const init = async () => {
            const auth = getAuth();
            if (!auth?.user) return;
            setCurrentUser(auth.user);

            try {
                // 1. Fetch Users
                let users = [];
                try {
                    const res = await userAPI.all();
                    users = res.data.users || [];
                } catch (e) {
                    console.warn("Could not fetch full user list");
                }
                const others = users.filter(u =>
                    u.email !== auth.user.email &&
                    ['ADMIN', 'EMPLOYEE'].includes(u.role?.toUpperCase())
                );
                setColleagues(others);
                setFilteredColleagues(others);

                // 2. Fetch Groups
                try {
                    const gRes = await chatAPI.myGroups(auth.user.email);
                    setGroups(gRes.data || []);
                } catch (e) {
                    console.error("Failed to fetch groups", e);
                }

            } catch (error) {
                console.error("Init Error", error);
            }
        };
        init();
    }, []);

    // --- Search Filter (Updates to include Groups?) --- 
    // For now keeping simple.

    // --- 3. Chat Fetching ---
    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        const fetchChat = async () => {
            try {
                let res;
                if (selectedUser.isGroup) {
                    res = await chatAPI.groupHistory(selectedUser.id);
                } else {
                    res = await chatAPI.history(currentUser.email, selectedUser.email);
                }
                setMessages(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Fetch chat error");
            } finally {
                setLoadingChat(false);
            }
        };

        setLoadingChat(true);
        fetchChat();

        const interval = setInterval(() => {
            if (selectedUser.isGroup) {
                chatAPI.groupHistory(selectedUser.id)
                    .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
                    .catch(() => { });
            } else {
                chatAPI.history(currentUser.email, selectedUser.email)
                    .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
                    .catch(e => null);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedUser, currentUser]);

    // ... (Auto Scroll is same) ...


    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // --- 5. Handlers ---
    const handleUserSelect = (item) => {
        setSelectedUser(item); // Item can be user or group
        setNewMessage("");
        setSelectedFile(null);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim() || selectedGroupMembers.length === 0) return;

        try {
            const payload = {
                name: newGroupName,
                admin: currentUser.email,
                members: selectedGroupMembers
            };
            const res = await chatAPI.createGroup(payload);
            const newGroup = { ...res.data, isGroup: true };
            setGroups(prev => [...prev, newGroup]);
            setShowGroupModal(false);
            setNewGroupName("");
            setSelectedGroupMembers([]);
            toast.success("Group created!");
        } catch (e) {
            toast.error("Failed to create group");
        }
    };

    const toggleMemberSelection = (email) => {
        setSelectedGroupMembers(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

        const content = newMessage.trim();
        const tempId = "temp-" + Date.now();

        // 1. Optimistic UI
        const tempMsg = {
            senderEmail: currentUser.email,
            recipientEmail: selectedUser.isGroup ? null : selectedUser.email,
            content: content,
            timestamp: new Date().toISOString(),
            id: tempId,
            read: false,
            groupId: selectedUser.isGroup ? selectedUser.id : null,
            fileName: selectedFile?.name,
            filtered: !!selectedFile
        };
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");
        setSelectedFile(null);

        // 2. API Call
        try {
            await chatAPI.send({
                sender: currentUser.email,
                recipient: selectedUser.isGroup ? null : selectedUser.email,
                groupId: selectedUser.isGroup ? selectedUser.id : null,
                content: content,
                file: selectedFile
            });
        } catch (error) {
            toast.error("Message failed to send");
        }
    };

    // ... (Date Grouping same) ...
    const groupedMessages = messages.reduce((groups, message) => {
        const date = new Date(message.timestamp).toLocaleDateString(undefined, {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
        return groups;
    }, {});

    const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex h-[85vh] w-full overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200 font-sans relative">

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-fadeIn flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">New Chat</h2>
                            <button onClick={() => setShowNewChatModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {colleagues.map(user => (
                                <div
                                    key={user.email}
                                    className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50"
                                    onClick={() => {
                                        handleUserSelect(user);
                                        setShowNewChatModal(false);
                                    }}
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                                        className="w-10 h-10 rounded-full"
                                        alt={user.fullName}
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{user.fullName}</p>
                                        <p className="text-xs text-gray-500">{user.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            {showGroupModal && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">New Group</h2>
                        <input
                            className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-[#00a884] outline-none"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                        />
                        <p className="mb-2 text-sm font-semibold text-gray-600">Select Members:</p>
                        <div className="max-h-[200px] overflow-y-auto border rounded mb-4">
                            {colleagues.map(user => (
                                <div
                                    key={user.email}
                                    className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${selectedGroupMembers.includes(user.email) ? 'bg-[#d9fdd3]' : ''}`}
                                    onClick={() => toggleMemberSelection(user.email)}
                                >
                                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedGroupMembers.includes(user.email) ? 'bg-[#00a884] border-[#00a884]' : 'border-gray-400'}`}>
                                        {selectedGroupMembers.includes(user.email) && <CheckIcon className="w-3 h-3 text-white" />}
                                    </div>
                                    <span>{user.fullName}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowGroupModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleCreateGroup} className="px-4 py-2 bg-[#00a884] text-white rounded hover:opacity-90">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className={`w-full md:w-[350px] flex flex-col border-r border-gray-200 bg-white ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="px-4 py-3 bg-[#f0f2f5] border-b border-gray-200 flex justify-between items-center h-[60px] shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://ui-avatars.com/api/?name=${currentUser?.fullName || 'Me'}&background=00a884&color=fff`}
                            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
                            alt="My Profile"
                        />
                        <span className="font-semibold text-gray-700">Chats</span>
                    </div>
                    <div className="flex gap-4 text-[#54656f]">
                        <ChatBubbleLeftRightIcon
                            className="w-6 h-6 cursor-pointer hover:text-gray-900"
                            title="New Chat"
                            onClick={() => setShowNewChatModal(true)}
                        />
                        <UsersIcon
                            className="w-6 h-6 cursor-pointer hover:text-gray-900"
                            title="New Group"
                            onClick={() => setShowGroupModal(true)}
                        />
                        <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer hover:text-gray-900" />
                    </div>
                </div>

                {/* Search */}
                <div className="p-2 border-b border-gray-100 bg-white">
                    <div className="bg-[#f0f2f5] rounded-lg flex items-center px-3 py-1.5 min-h-[35px]">
                        <MagnifyingGlassIcon className="w-5 h-5 text-[#54656f] mr-3" />
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#54656f]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* GROUPS SECTION */}
                    {groups.length > 0 && (
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Groups</div>
                    )}
                    {groups.map(group => (
                        <div
                            key={'g-' + group.id}
                            onClick={() => handleUserSelect({ ...group, isGroup: true })}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 hover:bg-[#f5f6f6] transition
                      ${selectedUser?.id === group.id && selectedUser?.isGroup ? 'bg-[#f0f2f5]' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {group.name[0]?.toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-gray-900 font-medium truncate text-[15px]">{group.name}</h4>
                                <p className="text-xs text-gray-500 truncate">Group items</p>
                            </div>
                        </div>
                    ))}

                    {/* CONTACTS SECTION - ONLY VISIBLE IF SEARCHING */}
                    {searchQuery.trim() && (
                        <>
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">Search Results</div>
                            {filteredColleagues.map(user => (
                                <div
                                    key={user.id || user.email}
                                    onClick={() => handleUserSelect(user)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 hover:bg-[#f5f6f6] transition
                            ${selectedUser?.email === user.email && !selectedUser.isGroup ? 'bg-[#f0f2f5]' : ''}`}
                                >
                                    <div className="relative">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                                            className="w-12 h-12 rounded-full object-cover"
                                            alt={user.fullName}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-gray-900 font-medium truncate text-[15px]">{user.fullName}</h4>
                                        <p className="text-xs text-gray-500 truncate capitalize">
                                            {user.role?.toLowerCase() || 'Employee'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {!searchQuery.trim() && groups.length === 0 && (
                        <div className="mt-10 text-center px-6">
                            <p className="text-gray-400 text-sm">No active chats.</p>
                            <p className="text-gray-500 text-xs mt-2">Click the chat icon to start a new conversation.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side (Chat) - Minimal Changes needed here except header name */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] w-full md:w-auto relative">
                    {/* Header */}
                    <div className="h-[60px] px-4 py-2 bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSelectedUser(null)} className="md:hidden mr-3 text-gray-600">
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                            {selectedUser.isGroup ? (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {selectedUser.name[0]}
                                </div>
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${selectedUser.fullName}&background=random`}
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    alt="Current Chat"
                                />
                            )}
                            <div className="flex flex-col justify-center">
                                <span className="font-semibold text-gray-900 leading-tight">
                                    {selectedUser.isGroup ? selectedUser.name : selectedUser.fullName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {selectedUser.isGroup ? 'Group Chat' : 'Business Account'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-[#54656f] pr-2">
                            <MagnifyingGlassIcon className="w-5 h-5 cursor-pointer" />
                            <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer" />
                        </div>
                    </div>

                    {/* Chat Area & Footer */}
                    <div
                        className="flex-1 overflow-y-auto p-4 sm:px-8 space-y-2 relative bg-[#e5ddd5]"
                    >
                        {loadingChat ? (
                            <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884]"></div></div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-gray-500 text-sm font-medium">Start chatting!</p>
                            </div>
                        ) : (
                            Object.entries(groupedMessages).map(([date, msgs]) => (
                                <React.Fragment key={date}>
                                    <div className="flex justify-center my-4 sticky top-0 z-10">
                                        <span className="bg-white shadow-sm border border-gray-100 text-gray-500 text-[11px] font-medium px-3 py-1 rounded-lg uppercase tracking-wide">
                                            {date}
                                        </span>
                                    </div>
                                    {msgs.map((msg, i) => {
                                        const isMe = msg.senderEmail === currentUser.email;
                                        return (
                                            <div key={i} className={`flex w-full mb-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className={`relative max-w-[85%] sm:max-w-[60%] px-3 pt-1.5 pb-1 text-[14px] leading-5 rounded-lg shadow-sm ${isMe ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none" : "bg-white text-gray-900 rounded-tl-none"
                                                        }`}
                                                >
                                                    {/* Show Sender Name in Group Chat if not me */}
                                                    {!isMe && selectedUser.isGroup && (
                                                        <p className="text-[10px] font-bold text-orange-800 mb-0.5">{msg.senderEmail.split('@')[0]}</p>
                                                    )}

                                                    {msg.fileName && (
                                                        <div className="mb-1 p-2 bg-black/5 rounded flex items-center gap-2">
                                                            <div className="bg-gray-200 p-2 rounded">📄</div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{msg.fileName}</p>
                                                                <p className="text-xs text-gray-500 uppercase">FILE</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="break-words whitespace-pre-wrap pr-2">{msg.content}</div>
                                                    <div className="flex justify-end items-center gap-1 mt-0.5 select-none">
                                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                                            {formatTime(msg.timestamp)}
                                                        </span>
                                                        {isMe && (
                                                            <span className={msg.read ? "text-[#53bdeb]" : "text-gray-400"}>
                                                                <CheckIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <footer className="h-[62px] bg-[#f0f2f5] px-4 py-2 flex items-center gap-3 border-t border-gray-300 z-20 shrink-0">
                        <FaceSmileIcon className="w-7 h-7 text-[#54656f] cursor-pointer" />
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <PaperClipIcon
                            className="w-7 h-7 text-[#54656f] cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        />
                        {selectedFile && (
                            <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-xs">
                                <span className="truncate max-w-[100px]">{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="text-red-500 font-bold">×</button>
                            </div>
                        )}
                        <form onSubmit={handleSend} className="flex-1 h-full">
                            <input
                                type="text"
                                className="w-full h-full rounded-md px-4 bg-white border-0 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-[#54656f] text-[15px]"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </form>
                        {newMessage.trim() || selectedFile ? (
                            <button onClick={handleSend} className="p-2 bg-[#00a884] rounded-full text-white hover:bg-[#008f6f] transition">
                                <PaperAirplaneIcon className="w-5 h-5 ml-0.5" />
                            </button>
                        ) : (
                            <MicrophoneIcon className="w-7 h-7 text-[#54656f] cursor-pointer" />
                        )}
                    </footer>

                </div>
            ) : (
                <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#f0f2f5] border-b-8 border-[#25d366]">
                    <div className="w-[300px] text-center">
                        <div className="mb-8">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Whatsapp" className="w-20 h-20 mx-auto opacity-20" />
                        </div>
                        <h1 className="text-3xl font-light text-[#41525d] mb-4">Kanakkaalar Web</h1>
                        <p className="text-[#667781] text-sm leading-6">
                            Select a colleague or group to start collaborating.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
