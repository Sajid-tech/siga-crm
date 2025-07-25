import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";
import Page from '../dashboard/page'
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const TestView = () => {
    const componentRef = useRef();
  const { id } = useParams();
  const {
    data: participantDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participantDetails", id],
    queryFn: async () => {
      if (!id) return null;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-participant-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.participant;
    },
    enabled: !!id,
  });

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Participant-${participantDetails?.name_of_firm || 'Details'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 4mm;
      }
      @media print {
        body {
        border:1px solid #000;
          margin: 1mm;
          padding: 1mm;
          min-height:100vh
        }
      }
    `
  });

  // Handle loading and error states
  if (!id) return <div>No Participant Selected</div>;
   // Render loading state
   if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Participants Details
          </Button>
        </div>
      </Page>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10 ">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Participants details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }


  return (
   <Page>
       <div>
      <Button 
       
        onClick={handlePrint} 
        className="mb-4  px-4 py-2 "
      >
        Print Participant Details
      </Button>

      <div ref={componentRef} className="p-6">
        {/* Header */}
        <div className="flex flex-row items-center gap-4 justify-between mb-6 pb-4 border-b-2 border-gray-300">
       <div>
       <h1 className="text-2xl font-bold">{participantDetails.name_of_firm}</h1>
       <h4 className="w-96 text-sm">{participantDetails.distributor_agent_address}</h4>
       </div>
          <div className="text-xl text-gray-600">
            <span>{participantDetails.brand_name}</span>

          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Firm Information */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-3">Firm Information</h2>
            <DetailRow label="Manufacturer Name" value={participantDetails.manufacturer_name} />
            <DetailRow label="GST Number" value={participantDetails.gst_no} />
            <DetailRow label="Distributer" value={participantDetails.distributor_agent_name} />
          </div>

          {/* Product Categories */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-3">Product Categories</h2>
            <div className="flex gap-4 mb-3">
              <CategoryCheckbox label="Men" checked={participantDetails.category_men === 'Yes'} />
              <CategoryCheckbox label="Women" checked={participantDetails.category_women === 'Yes'} />
              <CategoryCheckbox label="Kids" checked={participantDetails.category_kids === 'Yes'} />
              <CategoryCheckbox label="Accessories" checked={participantDetails.category_accessories === 'Yes'} />
            </div>
            <DetailRow label="Product Description" value={participantDetails.product_description} />
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-3">Contact Information</h2>
            <DetailRow label="Email" value={participantDetails.profile_email} />
          </div>

          {/* Representatives */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-3">Representatives</h2>
            <div className="space-y-2">
              <div className=" border-b pb-1">
                <span>Rep 1: {participantDetails.rep1_name} {participantDetails.rep1_mobile ?  `- ${participantDetails.rep1_mobile}`:""}</span>
          
              </div>
              <div className="flex justify-between">
                <span>{participantDetails.rep2_name ? `Rep 2: ${participantDetails.rep2_name}`:""}   {participantDetails.rep2_mobile ?  `- ${participantDetails.rep2_mobile}`:""}</span>
               
              </div>
            </div>
          </div>
          </div>
          {/* Fair Participation Details */}
          <div className="mt-6">
            <h2 className="text-xl   font-semibold border-b mb-3">Fair Advertisement Details</h2>
      
            <div className="flex  gap-4 mb-3">
              <CategoryCheckbox label="Fair Guide" checked={participantDetails.fair_guide === 'Yes'} />
              <CategoryCheckbox label="Branding at Venue" checked={participantDetails.branding_at_venue === 'Yes'} />
              <CategoryCheckbox label="Fashion Show" checked={participantDetails.fashion_show === 'Yes'} />
              <CategoryCheckbox label="Sponsorship" checked={participantDetails.be_an_sponsor === 'Yes'} />
            </div>
          </div>

          {/* Stall and Payment Details */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold border-b mb-3">Stall and Payment Details</h2>
            <div className=" grid grid-cols-2 gap-5">
            <DetailRow label="Amount" value={participantDetails.profile_amount} />

            <DetailRow label="Remarks" value={participantDetails.profile_remark} />
            <DetailRow label="Status" value={participantDetails.profile_status} />
            <DetailRow label="Stall" value={`${participantDetails.profile_new_stall_no} (${participantDetails.profile_stall_size})`}  />
            </div>
           
          </div>



 
      </div>
    </div>
   </Page>
  )
}

 
// Utility Components
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between text-sm py-1 border-b">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value || 'N/A'}</span>
    </div>
  );
  
  const CategoryCheckbox = ({ label, checked }) => (
    <div className="flex items-center gap-2">
      <input
      type="checkbox" 
      checked={checked}
      readOnly
      
      className="w-4 h-4  accent-black cursor-default"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
export default TestView