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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Copy,
  Check,
  PlusCircle,
  Settings,
  Users,
  Trash2,
  User,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Server, User as PrismaUser } from "@prisma/client";
import { EditServerModal } from "./edit-server-modal";
import ManageMemberDialog from "./manage-member-dialog";
import { CreateChannelModal } from "./create-channel-modal";
import axios from "axios";

type ServerWithMembers = Server & {
  members: (PrismaUser & { role: string })[];
};

export default function ServerDashboard({
  userServers,
  server,
  currentUser,
}: {
  userServers: ServerWithMembers[];
  server: ServerWithMembers;
  currentUser: PrismaUser;
}) {
  const [selectedServer, setSelectedServer] =
    useState<ServerWithMembers>(server);
  const [serverSettingsModalOpen, setServerSettingsModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [deleteLeaveDialogOpen, setDeleteLeaveDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateServer = () => {
    console.log("Create server functionality not implemented");
  };

  const handleDeleteServer = async () => {
    try {
      const response = await axios.delete(`/api/server/${selectedServer.id}`);
      console.log("Server deleted successfully", response);
    } catch (error) {
      console.error("Error deleting server", error);
    }
    console.log("Delete server functionality not implemented");
    setSelectedServer(null);
    setDeleteLeaveDialogOpen(false);
  };

  const handleLeaveServer = async () => {
    try {
      const response = await axios.patch(
        `/api/server/${selectedServer.id}/leave`
      );
      console.log("Left server successfully", response);
      setSelectedServer(null);
      setDeleteLeaveDialogOpen(false);
    } catch (error) {
      console.error("Error leaving server", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleCopyInviteLink = () => {
    if (selectedServer) {
      const inviteLink = `http://localhost:3000/servers/invite/${selectedServer.id}`;
      navigator.clipboard.writeText(inviteLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const isAdmin =
    selectedServer?.members.find((member) => member.user.id === currentUser.id)
      ?.role === "ADMIN";

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Server List Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Channel Sidebar */}
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
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setInviteModalOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Invite People</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setServerSettingsModalOpen(true)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Server Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setManageMembersOpen(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>Manage Members</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setCreateChannelOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Create Channel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteLeaveDialogOpen(true)}
                    >
                      {isAdmin ? (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Server</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Leave Server</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Channel list would go here */}
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
          <h1 className="text-2xl font-bold mb-6">Your Servers</h1>
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
                      {server.members.length} members
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

      {/* Invite Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite People to {selectedServer?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={`http://localhost:3000/servers/invite/${selectedServer?.id}`}
              className="flex-grow"
            />
            <Button onClick={handleCopyInviteLink} className="flex-shrink-0">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">
                {copied ? "Copied" : "Copy invite link"}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Members Dialog */}
      <ManageMemberDialog
        open={manageMembersOpen}
        onOpenChange={setManageMembersOpen}
        selectedServer={selectedServer}
      />

      {/* Edit Server Modal */}
      <EditServerModal
        open={serverSettingsModalOpen}
        onOpenChange={setServerSettingsModalOpen}
        server={selectedServer}
      />

      {/* Create Channel Modal */}
      <CreateChannelModal
        open={createChannelOpen}
        onOpenChange={setCreateChannelOpen}
      />

      {/* Delete/Leave Server Dialog */}
      <Dialog
        open={deleteLeaveDialogOpen}
        onOpenChange={setDeleteLeaveDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAdmin ? "Delete Server" : "Leave Server"}
            </DialogTitle>
            <DialogDescription>
              {isAdmin
                ? "Are you sure you want to delete this server? This action cannot be undone."
                : "Are you sure you want to leave this server?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteLeaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={isAdmin ? handleDeleteServer : handleLeaveServer}
            >
              {isAdmin ? "Delete" : "Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
