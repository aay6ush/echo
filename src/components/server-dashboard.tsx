"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Settings,
  Users,
  MoreVertical,
  UserPlus,
  Trash2,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Server } from "@prisma/client";

export default function ServerDashboard({
  userServers,
}: {
  userServers: Server[];
}) {
  const [selectedServer, setSelectedServer] = useState(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateServer = () => {
    console.log("Create server functionality not implemented");
  };

  const handleDeleteServer = (id: string) => {
    console.log("Delete server functionality not implemented");
    setSelectedServer(null);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-20 bg-gray-200 dark:bg-gray-800 p-3 flex flex-col items-center">
        {userServers.map((server) => (
          <motion.div
            key={server.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xl font-bold mb-4 cursor-pointer"
            onClick={() => setSelectedServer(server)}
          >
            {server.name.charAt(0)}
          </motion.div>
        ))}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center cursor-pointer"
          onClick={handleCreateServer}
        >
          <PlusCircle className="text-white" />
        </motion.div>
      </div>

      <div className="flex-1 flex">
        <AnimatePresence>
          {selectedServer && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-100 dark:bg-gray-800 w-60 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedServer.name}</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Invite People</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Server Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Manage Members</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Create Channel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteServer(selectedServer.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Server</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-4">
                  {selectedServer.channels.text.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Text Channels
                      </h3>
                      {selectedServer.channels.text.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Hash className="h-4 w-4" />
                          <span>{channel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedServer.channels.voice.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Voice Channels
                      </h3>
                      {selectedServer.channels.voice.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Volume2 className="h-4 w-4" />
                          <span>{channel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedServer.channels.video.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Video Channels
                      </h3>
                      {selectedServer.channels.video.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Video className="h-4 w-4" />
                          <span>{channel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Server Grid */}
        <div className="flex-1 p-6 relative">
          <div className="absolute top-6 right-6 flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-6">Your userServers</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userServers.map((server) => (
              <motion.div
                key={server.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer"
                  onClick={() => setSelectedServer(server)}
                >
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {server.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Object.values(server.channels).flat().length} channels
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer border-2 border-dashed"
                onClick={handleCreateServer}
              >
                <CardContent className="p-6 flex items-center justify-center">
                  <Button variant="ghost">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Server
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
