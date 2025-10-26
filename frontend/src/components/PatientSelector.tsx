import React from 'react';
import { Patient } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, UserPlus } from 'lucide-react';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  onViewPatient?: (patientId: string) => void;
  onAddPatient?: () => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onViewPatient,
  onAddPatient,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Patient</CardTitle>
          {onAddPatient && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddPatient}
              className="hover:bg-primary/10"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {patients.map((patient) => (
            <div key={patient.id} className="relative group">
              <Button
                variant={selectedPatientId === patient.id ? "default" : "outline"}
                onClick={() => onSelectPatient(patient.id)}
                className={`justify-start h-auto p-4 transition-all duration-200 hover:scale-[1.02] w-full ${
                  selectedPatientId === patient.id 
                    ? "bg-primary text-primary-foreground shadow-md border-primary" 
                    : "hover:bg-accent hover:text-accent-foreground border-border"
                }`}
              >
                <div className="text-left w-full pr-8">
                  <div className={`font-semibold text-base ${
                    selectedPatientId === patient.id 
                      ? "text-primary-foreground" 
                      : "text-foreground"
                  }`}>
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className={`text-sm mt-1 ${
                    selectedPatientId === patient.id 
                      ? "text-primary-foreground/80" 
                      : "text-muted-foreground"
                  }`}>
                    <span className="font-medium">ID:</span> {patient.patientId} • 
                    <span className="font-medium ml-1">DOB:</span> {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </div>
                </div>
              </Button>
              {onViewPatient && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewPatient(patient.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/20 bg-background/80 backdrop-blur-sm shadow-sm"
                  title="View patient details"
                >
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSelector;
