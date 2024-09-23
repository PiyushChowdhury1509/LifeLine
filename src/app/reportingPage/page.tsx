'use client';
import { useState, useRef, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const UploadForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<string | null>(null); 
  const [phoneNumber, setPhoneNumber] = useState<string>(''); 
  const [otp, setOtp] = useState<string[]>(['', '', '', '']); 
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

  const handleVerificationMethodChange = (method: string) => {
    setVerificationMethod(method);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const file of files) {
      formData.append('file', file);
    }
    
    for (const videoFile of videoFiles) {
      formData.append('file', videoFile);
    }
  
    formData.append('description', description);
    formData.append('reporters', email);
  
    toast.info('Uploading files...', { position: "top-center" });
  
    try {
      const uploadResponse = await fetch('/api/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Network response was not ok.');
      }

      const uploadData = await uploadResponse.json();
      toast.success('Files uploaded successfully!', { position: "top-center" });

      let location = {
        type: 'Point',
        coordinates: [0, 0], 
      };

      const position = await new Promise<GeolocationCoordinates | null>((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            () => resolve(null)
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          resolve(null);
        }
      });

      if (position) {
        location = {
          type: 'Point',
          coordinates: [position.longitude, position.latitude],
        };
      }

      const reportData = {
        description,
        reporters: [email], 
        photos: uploadData.urls.filter((url: string) => url.includes('image')), 
        videos: uploadData.urls.filter((url: string) => url.includes('video')),
        location,  
        nearestVolunteers: [], // This should be populated in the backend
      };

      toast.info('Submitting accident report...', { position: "top-center" });

      const reportResponse = await fetch('/api/reportAccident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!reportResponse.ok) {
        throw new Error('Network response was not ok.');
      }

      const reportDataResponse = await reportResponse.json();
      toast.success('Accident reported successfully!', { position: "top-center" });
      console.log(reportDataResponse);

    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { position: "top-center" });
    }
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      <ToastContainer />
      <br/>
      <br/>
      <div className="bg-[#0D1117] text-[#C9D1D9] min-h-screen p-8 space-y-8">
        {/* Top Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#58A6FF]">Accident Reporting</h1>
          <p className="text-[#C9D1D9] mt-2">
            Use this form to report accidents by uploading relevant photos, videos, and descriptions.
          </p>
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
          <div className="space-y-4">
            <div className="border-b border-[#C9D1D9] pb-2">
              <button onClick={() => toggleFAQ(1)} className="w-full text-left">
                <h3 className="text-lg text-[#C9D1D9] hover:text-[#58A6FF]">
                  What types of files can I upload?
                </h3>
              </button>
              {activeFAQ === 1 && (
                <p className="text-[#C9D1D9] mt-2">
                  You can upload images and videos relevant to the accident.
                </p>
              )}
            </div>
            <div className="border-b border-[#C9D1D9] pb-2">
              <button onClick={() => toggleFAQ(2)} className="w-full text-left">
                <h3 className="text-lg text-[#C9D1D9] hover:text-[#58A6FF]">
                  How will my data be used?
                </h3>
              </button>
              {activeFAQ === 2 && (
                <p className="text-[#C9D1D9] mt-2">
                  Your data will be used to provide timely assistance and share with relevant authorities.
                </p>
              )}
            </div>
            <div className="border-b border-[#C9D1D9] pb-2">
              <button onClick={() => toggleFAQ(3)} className="w-full text-left">
                <h3 className="text-lg text-[#C9D1D9] hover:text-[#58A6FF]">
                  Can I report anonymously?
                </h3>
              </button>
              {activeFAQ === 3 && (
                <p className="text-[#C9D1D9] mt-2">
                  Yes, you can choose not to share personal information while reporting.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadForm;
