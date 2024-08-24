import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";

// Define the props type for the component
type RankedIssueProps = {
  rank: number;
  title: string;
  description: string;
  wardName: string;
};

const RankedIssue: React.FC<RankedIssueProps> = ({
  rank,
  title,
  description,
  wardName,
}) => {
  return (
    <div className="m-3">
      <Card className="w-full h-auto p-4 shadow-lg flex items-center justify-between content-center">
        <div className="flex items-center flex-grow">
          <CardHeader>
            <CardTitle>{rank}</CardTitle>
          </CardHeader>
          <Separator
            orientation="vertical"
            className="h-10 w-[1px] bg-gray-300 mx-4"
          />
          <CardContent>
            <CardTitle className="flex justify-between">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardContent>
        </div>
        <div className="flex items-center">
          <Separator
            orientation="vertical"
            className="h-10 w-[1px] bg-gray-400 mx-4"
          />
          <CardFooter className="flex items-center gap-2">
            <MapPin />
            <CardTitle>{wardName}</CardTitle>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default RankedIssue;
