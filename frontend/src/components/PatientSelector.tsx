import React from 'react';
import { Patient } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye } from 'lucide-react';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  onViewPatient?: (patientId: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onViewPatient,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Patient</CardTitle>
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                  title="View patient details"
                >
                  <Eye className="h-4 w-4" />
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
