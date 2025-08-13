// uniform-frontend/src/components/student/AcademicInfoForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import type { AcademicInfo } from '@/components/student/types';

interface AcademicInfoFormProps {
  academicInfo?: AcademicInfo;
  userId: string;
  onSave: (academicInfo: AcademicInfo) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function AcademicInfoForm({
  academicInfo,
  userId,
  onSave,
  onCancel,
  isEditing = false
}: AcademicInfoFormProps) {
  const [formData, setFormData] = useState<AcademicInfo>(() => {
    if (academicInfo) {
      return { ...academicInfo };
    }
    return {
      userId,
      curriculum: 'national',
      ssc: {
        gpa: 0,
        board: '',
        passingYear: new Date().getFullYear(),
        roll: '',
        registration: ''
      },
      hsc: {
        gpa: 0,
        board: '',
        passingYear: new Date().getFullYear(),
        roll: '',
        registration: ''
      }
    };
  });

  const [oLevelSubjects, setOLevelSubjects] = useState([
    { name: '', grade: '' },
    { name: '', grade: '' }
  ]);

  const [aLevelSubjects, setALevelSubjects] = useState([
    { name: '', grade: '' },
    { name: '', grade: '' }
  ]);

  const handleCurriculumChange = (curriculum: 'national' | 'british') => {
    setFormData(prev => ({
      ...prev,
      curriculum,
      // Reset the opposite curriculum data
      ...(curriculum === 'national' ? { oLevel: undefined, aLevel: undefined } : { ssc: undefined, hsc: undefined })
    }));
  };

  const handleSSCChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      ssc: {
        ...prev.ssc!,
        [field]: value
      }
    }));
  };

  const handleHSCChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      hsc: {
        ...prev.hsc!,
        [field]: value
      }
    }));
  };

  const handleOLevelChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      oLevel: {
        ...prev.oLevel!,
        [field]: value
      }
    }));
  };

  const handleALevelChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      aLevel: {
        ...prev.aLevel!,
        [field]: value
      }
    }));
  };

  const handleOLevelSubjectChange = (index: number, field: 'name' | 'grade', value: string) => {
    const newSubjects = [...oLevelSubjects];
    newSubjects[index][field] = value;
    setOLevelSubjects(newSubjects);
  };

  const handleALevelSubjectChange = (index: number, field: 'name' | 'grade', value: string) => {
    const newSubjects = [...aLevelSubjects];
    newSubjects[index][field] = value;
    setALevelSubjects(newSubjects);
  };

  const addOLevelSubject = () => {
    setOLevelSubjects([...oLevelSubjects, { name: '', grade: '' }]);
  };

  const removeOLevelSubject = (index: number) => {
    if (oLevelSubjects.length > 1) {
      setOLevelSubjects(oLevelSubjects.filter((_, i) => i !== index));
    }
  };

  const addALevelSubject = () => {
    setALevelSubjects([...aLevelSubjects, { name: '', grade: '' }]);
  };

  const removeALevelSubject = (index: number) => {
    if (aLevelSubjects.length > 1) {
      setALevelSubjects(aLevelSubjects.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalData = { ...formData };

    if (formData.curriculum === 'british') {
      finalData = {
        ...finalData,
        oLevel: {
          ...finalData.oLevel!,
          subjects: oLevelSubjects.filter(s => s.name && s.grade)
        },
        aLevel: {
          ...finalData.aLevel!,
          subjects: aLevelSubjects.filter(s => s.name && s.grade)
        }
      };
    }

    onSave(finalData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isEditing ? 'Edit Academic Information' : 'Add Academic Information'}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="curriculum">Curriculum</Label>
            <Select
              value={formData.curriculum}
              onValueChange={handleCurriculumChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select curriculum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">National Curriculum (SSC/HSC)</SelectItem>
                <SelectItem value="british">British Curriculum (O-Level/A-Level)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.curriculum === 'national' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SSC Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sscGpa">GPA</Label>
                    <Input
                      id="sscGpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formData.ssc?.gpa || ''}
                      onChange={(e) => handleSSCChange('gpa', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sscBoard">Board</Label>
                    <Input
                      id="sscBoard"
                      value={formData.ssc?.board || ''}
                      onChange={(e) => handleSSCChange('board', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sscPassingYear">Passing Year</Label>
                    <Input
                      id="sscPassingYear"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={formData.ssc?.passingYear || ''}
                      onChange={(e) => handleSSCChange('passingYear', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sscRoll">Roll Number</Label>
                    <Input
                      id="sscRoll"
                      value={formData.ssc?.roll || ''}
                      onChange={(e) => handleSSCChange('roll', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sscRegistration">Registration Number</Label>
                    <Input
                      id="sscRegistration"
                      value={formData.ssc?.registration || ''}
                      onChange={(e) => handleSSCChange('registration', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">HSC Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hscGpa">GPA</Label>
                    <Input
                      id="hscGpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formData.hsc?.gpa || ''}
                      onChange={(e) => handleHSCChange('gpa', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hscBoard">Board</Label>
                    <Input
                      id="hscBoard"
                      value={formData.hsc?.board || ''}
                      onChange={(e) => handleHSCChange('board', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hscPassingYear">Passing Year</Label>
                    <Input
                      id="hscPassingYear"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={formData.hsc?.passingYear || ''}
                      onChange={(e) => handleHSCChange('passingYear', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hscRoll">Roll Number</Label>
                    <Input
                      id="hscRoll"
                      value={formData.hsc?.roll || ''}
                      onChange={(e) => handleHSCChange('roll', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hscRegistration">Registration Number</Label>
                    <Input
                      id="hscRegistration"
                      value={formData.hsc?.registration || ''}
                      onChange={(e) => handleHSCChange('registration', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {formData.curriculum === 'british' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">O-Level Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oLevelBoard">Board</Label>
                    <Input
                      id="oLevelBoard"
                      value={formData.oLevel?.board || ''}
                      onChange={(e) => handleOLevelChange('board', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oLevelPassingYear">Passing Year</Label>
                    <Input
                      id="oLevelPassingYear"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={formData.oLevel?.passingYear || ''}
                      onChange={(e) => handleOLevelChange('passingYear', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oLevelCandidateNumber">Candidate Number</Label>
                    <Input
                      id="oLevelCandidateNumber"
                      value={formData.oLevel?.candidateNumber || ''}
                      onChange={(e) => handleOLevelChange('candidateNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium">Subjects & Grades</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addOLevelSubject}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subject
                    </Button>
                  </div>
                  {oLevelSubjects.map((subject, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor={`oLevelSubjectName${index}`}>Subject Name</Label>
                        <Input
                          id={`oLevelSubjectName${index}`}
                          value={subject.name}
                          onChange={(e) => handleOLevelSubjectChange(index, 'name', e.target.value)}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`oLevelSubjectGrade${index}`}>Grade</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`oLevelSubjectGrade${index}`}
                            value={subject.grade}
                            onChange={(e) => handleOLevelSubjectChange(index, 'grade', e.target.value)}
                            placeholder="e.g., A*"
                          />
                          {oLevelSubjects.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOLevelSubject(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">A-Level Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aLevelBoard">Board</Label>
                    <Input
                      id="aLevelBoard"
                      value={formData.aLevel?.board || ''}
                      onChange={(e) => handleALevelChange('board', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aLevelPassingYear">Passing Year</Label>
                    <Input
                      id="aLevelPassingYear"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={formData.aLevel?.passingYear || ''}
                      onChange={(e) => handleALevelChange('passingYear', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aLevelCandidateNumber">Candidate Number</Label>
                    <Input
                      id="aLevelCandidateNumber"
                      value={formData.aLevel?.candidateNumber || ''}
                      onChange={(e) => handleALevelChange('candidateNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium">Subjects & Grades</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addALevelSubject}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subject
                    </Button>
                  </div>
                  {aLevelSubjects.map((subject, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor={`aLevelSubjectName${index}`}>Subject Name</Label>
                        <Input
                          id={`aLevelSubjectName${index}`}
                          value={subject.name}
                          onChange={(e) => handleALevelSubjectChange(index, 'name', e.target.value)}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`aLevelSubjectGrade${index}`}>Grade</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`aLevelSubjectGrade${index}`}
                            value={subject.grade}
                            onChange={(e) => handleALevelSubjectChange(index, 'grade', e.target.value)}
                            placeholder="e.g., A*"
                          />
                          {aLevelSubjects.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeALevelSubject(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Save'} Academic Information
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}