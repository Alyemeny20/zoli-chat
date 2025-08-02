import React from "react";

const Sidebar = ({ contacts = [], onSelect, selectedContact, usersState = [] }) => {
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 font-bold text-lg bg-teal-600 text-white border-b">
        جهات الاتصال
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => {
          const userInfo = usersState?.find((u) => u.name === contact.name);
          const status = userInfo ? userInfo.status : contact.status;

          return (
            <div
              key={contact.id || contact.name}
              onClick={() => onSelect(contact)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
                selectedContact?.id === contact.id ? "bg-teal-50" : ""
              }`}
            >
              <img
               src="/images/avatar.png"
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
                  />

         <div className="flex-1">
                <div className="font-bold">{contact.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {contact.lastMessage || ""}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    status === "online" ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {status === "online" ? "متصل الآن" : "غير متصل"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
