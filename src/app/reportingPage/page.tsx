'use client';
import { useState, useRef, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import { useRouter } from 'next/navigation';

const loadingStates = [
  { text: "Preparing to upload files" },
  { text: "Uploading images and videos" },
  { text: "Finding nearby volunteers" },
  { text: "Submitting accident report" },
];

const UploadForm: React.FC = () => {
  const router=useRouter();
  const [loading, setLoading] = useState(false); 
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>(''); 

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setVideoFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setVideoPreviewUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleAddFiles = (e: React.MouseEvent<HTMLButtonElement>, type: 'image' | 'video') => {
    e.preventDefault();
    if (type === 'image') {
      imageInputRef.current?.click();
    } else if (type === 'video') {
      videoInputRef.current?.click();
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setCurrentStep(0);
    try {
      setCurrentStep(1); 
      const formData = new FormData();
      files.forEach(file => formData.append('file', file));
      videoFiles.forEach(videoFile => formData.append('file', videoFile));
      formData.append('description', description);
      formData.append('reporters', email);

      const uploadResponse = await fetch('/api/uploadFiles', { method: 'POST', body: formData });
      if (!uploadResponse.ok) throw new Error('File upload failed.');
      const uploadData = await uploadResponse.json();

      setCurrentStep(2); 
      let location = { type: 'Point', coordinates: [0, 0] };
      const position = await new Promise<GeolocationCoordinates | null>((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords), () => resolve(null));
        } else {
          resolve(null);
        }
      });
      if (position) location.coordinates = [position.longitude, position.latitude];

      setCurrentStep(3); 
      const reportData = {
        description,
        reporters: [email],
        photos: uploadData.urls.filter((url: string) => url.includes('image')),
        videos: uploadData.urls.filter((url: string) => url.includes('video')),
        location,
      };
      const reportResponse = await fetch('/api/reportAccident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!reportResponse.ok) throw new Error('Report submission failed.');
      setCurrentStep(4); 
      toast.success('Accident reported successfully!');
      router.push('/thankyou')
    } 
    catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } 
    finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <ToastContainer />
      <Loader loadingStates={loadingStates} loading={loading} currentStep={currentStep} />
      <div className="bg-[#0D1117] text-[#C9D1D9] min-h-screen p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#58A6FF]">Accident Reporting</h1>
          <p className="text-[#C9D1D9] mt-2">Use this form to report accidents by uploading relevant photos, videos, and descriptions.</p>
        </div>

        {/* Upload and Preview Section */}
        <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">

          {/* Upload Section */}
          <Card className="bg-[#161B22] p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-2xl font-semibold mb-4 text-[#58A6FF]">Upload Images</h2>
            <p className="text-[#C9D1D9] mb-4">Please upload relevant images that describe the accident.</p>

            <Button onClick={(e:any) => handleAddFiles(e, 'image')} className="w-full bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300 mb-4">
              Add Images
            </Button>

            <input
              id="imageFileInput"
              type="file"
              accept="image/*"
              multiple
              capture="user" 
              onChange={handleFileChange}
              ref={imageInputRef}
              className="hidden"
            />

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#58A6FF]">Upload Videos</h2>
            <p className="text-[#C9D1D9] mb-4">Please upload relevant videos that describe the accident.</p>

            <Button onClick={(e: any) => handleAddFiles(e, 'video')} className="w-full bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300 mb-4">
              Add Videos
            </Button>

            <input
              id="videoFileInput"
              type="file"
              accept="video/*"
              multiple
              capture="environment" 
              onChange={handleVideoFileChange}
              ref={videoInputRef}
              className="hidden"
            />

            <div className="mb-4 mt-8">
              <label className="block text-[#C9D1D9] text-lg font-semibold mb-2">Description</label>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                className="w-full p-3 border rounded bg-[#0D1117] text-[#C9D1D9] h-32 resize-none"
                placeholder="Describe the content..."
              />
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="bg-[#161B22] p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-2xl font-bold mb-4 text-[#58A6FF]">Uploaded Photos</h2>
            <div className="flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-32 h-32 object-cover rounded-lg border border-[#0D1117]"
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#58A6FF]">Uploaded Videos</h2>
            <div className="flex flex-wrap gap-4">
              {videoPreviewUrls.map((url, index) => (
                <video key={index} src={url} controls className="w-32 h-32 rounded-lg border border-[#0D1117]"></video>
              ))}
            </div>
          </Card>
        </div>

        {/* Submission Section */}
        <Card className="bg-[#161B22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-[#58A6FF]">Submit Report</h2>
          <p className="text-[#C9D1D9] mb-4">Ensure all information is correct before submitting.</p>

          <Button onClick={handleSubmit} className="bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300">
            Submit Report
          </Button>
        </Card>

        {/* FAQ Section */}
        <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#58A6FF]">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg text-[#C9D1D9] hover:text-[#58A6FF]">
            What types of files can I upload?
          </AccordionTrigger>
          <AccordionContent className="text-[#C9D1D9]">
            You can upload images and videos relevant to the accident.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg text-[#C9D1D9] hover:text-[#58A6FF]">
            How will my data be used?
          </AccordionTrigger>
          <AccordionContent className="text-[#C9D1D9]">
            Your data will be used to provide timely assistance and not be shared with relevant authorities.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg text-[#C9D1D9] hover:text-[#58A6FF]">
            Can I report anonymously?
          </AccordionTrigger>
          <AccordionContent className="text-[#C9D1D9]">
            Yes, you can choose not to share personal information while reporting.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
      </div>
      {/*<ShootingStars/>
      <StarsBackground/>*/}
    </>
  );
};

export default UploadForm;
