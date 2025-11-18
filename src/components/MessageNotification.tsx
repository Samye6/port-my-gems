import { useNotification } from "@/contexts/NotificationContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const MessageNotification = () => {
  const { notification, isVisible } = useNotification();

  if (!notification) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-2 pointer-events-none transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-4 pointer-events-auto animate-fade-in backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 flex-shrink-0">
            {notification.avatar && <AvatarImage src={notification.avatar} alt={notification.name} />}
            <AvatarFallback className="bg-primary/20 text-primary">
              {notification.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-0.5">
              {notification.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {notification.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageNotification;
