import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { CircleUser, MoreVertical, Shield, Star } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageMemberDialog({
  open,
  onOpenChange,
  selectedServer,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedServer: ServerWithMembers | null;
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChangeRole = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/server/${selectedServer?.id}/members/${userId}`,
        {
          role: newRole,
        }
      );
      console.log("Success:", response.data);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
    console.log(`Changing role of user ${userId} to ${newRole}`);
  };

  const handleKickMember = async (userId: string) => {
    setLoading(true);
    // Implement kick member logic here
    try {
      const response = await axios.delete(
        `/api/server/${selectedServer?.id}/members/${userId}`
      );
      console.log("Member kicked successfully:", response.data);
      router.refresh();
    } catch (error) {
      console.error("Error kicking member:", error);
    }
    console.log(`Kicking user ${userId} from the server`);
    // Assuming kick member logic is similar to role change
    // Replace the comment with actual kick member logic
    setLoading(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "moderator":
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <CircleUser className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {selectedServer?.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.image} alt={member.user?.name} />
                  <AvatarFallback>{member.user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user?.name}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    {getRoleIcon(member.role)}
                    <span className="ml-1 capitalize">{member.role}</span>
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={loading}>
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Member options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => handleChangeRole(member.id, "ADMIN")}
                    disabled={loading}
                  >
                    Make Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleChangeRole(member.id, "MODERATOR")}
                    disabled={loading}
                  >
                    Make Moderator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleChangeRole(member.id, "GUEST")}
                    disabled={loading}
                  >
                    Make Guest
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleKickMember(member.id)}
                    className="text-red-600"
                    disabled={loading}
                  >
                    Kick Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
