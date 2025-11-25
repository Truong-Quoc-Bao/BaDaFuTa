import { Gift, Copy, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

export const PromotionBanner = ({ promotion }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(promotion.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{promotion.title}</h3>
              <p className="text-white/90 text-sm">
                {promotion.description ||
                  "Voucher được áp dụng trên toàn hệ thống!"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-white text-gray-800 font-mono"
            >
              {promotion.code}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
