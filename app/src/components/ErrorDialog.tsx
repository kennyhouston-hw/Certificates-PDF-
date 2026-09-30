import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ErrorDialogProps {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
}

export function ErrorDialog({ open, message, onOpenChange }: ErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm gap-2">
        <AlertDialogTitle>Ошибка</AlertDialogTitle>
        <AlertDialogDescription className="mb-2">{message}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
