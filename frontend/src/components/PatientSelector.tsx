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
        <div className="grid gap-2">
          {patients.map((patient) => (
            <Button
              key={patient.id}
              variant={selectedPatientId === patient.id ? "default" : "outline"}
              onClick={() => onSelectPatient(patient.id)}
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {patient.patientId} | DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
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
