import React from 'react';
import { Patient } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {patients.map((patient) => (
            <Button
              key={patient.id}
              variant={selectedPatientId === patient.id ? "default" : "outline"}
              onClick={() => onSelectPatient(patient.id)}
              className={`justify-start h-auto p-4 transition-all duration-200 hover:scale-[1.02] ${
                selectedPatientId === patient.id 
                  ? "bg-primary text-primary-foreground shadow-md border-primary" 
                  : "hover:bg-accent hover:text-accent-foreground border-border"
              }`}
            >
              <div className="text-left w-full">
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSelector;
