import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, Loader2, User, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
              <CardDescription className="text-center">
                Đăng nhập vào tài khoản BADAFUTA của bạn
              </CardDescription>
            </CardHeader>

            <form>
              <div className="space-y-4 ">
                <CardContent className="space-y-4">
                  {/* {error && (
                                        <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )} */}

                  {/* <div className="space-y-2">
                                    <Label htmlFor="unfid">UNFID</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                        id="unfid"
                                        type="text"
                                        placeholder="Nhập UNFID của bạn"
                                        value={unfid}
                                        onChange={(e) => setUnfid(e.target.value)}
                                        className="pl-10"
                                        disabled={isLoading}
                                        />
                                    </div>
                                    </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập Email của bạn"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        //disabled={isLoading}
                      >
                        {/* {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                                ) : (
                                                <Eye className="w-4 h-4" />
                                                )} */}
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    type="submit"
                    //className="w-full bg-orange-500 hover:bg-orange-600"
                    //disabled={isLoading}
                  >
                    {/* {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Đang đăng nhập...
                                        </>
                                        ) : (
                                        'Đăng nhập'
                                        )} */}
                    Đăng nhập
                  </Button>
                  <Link
                    to="#"
                    className="text-orange-600 text-sm hover:text-orange-700 hover:underline  "
                  >
                    Quên mật khẩu?
                  </Link>

                  <div className="my-2">
                    {/* Separator với chữ "Hoặc" */}
                    <div className="flex items-center gap-4 mb-4">
                      <Separator className="flex-1" />
                      <span className="text-gray-500">Hoặc</span>
                      <Separator className="flex-1" />
                    </div>

                    {/* Nút đăng nhập Google và Facebook cùng hàng */}
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                          alt="Google"
                          className="w-5 h-5"
                        />
                        Google
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/667px-2023_Facebook_icon.svg.png"
                          alt="Facebook"
                          className="w-5 h-5"
                        />
                        Facebook
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </form>

            <CardFooter className="">
              <Separator />
              <div className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Đăng ký ngay.
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
