import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeletePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  patientName: string;
  notesCount: number;
}

const DeletePatientDialog: React.FC<DeletePatientDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  patientName,
  notesCount,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Delete Patient</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2 space-y-3">
            <p>
              Are you sure you want to delete <span className="font-semibold text-foreground">{patientName}</span>?
            </p>
            {notesCount > 0 && (
              <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <p className="text-destructive font-medium">
                  ⚠️ Warning: This will also permanently delete {notesCount} {notesCount === 1 ? 'note' : 'notes'} associated with this patient.
                </p>
              </div>
            )}
            <p className="text-muted-foreground">
              This action cannot be undone and will permanently remove the patient record, all associated notes, and any audio files.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Patient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePatientDialog;

