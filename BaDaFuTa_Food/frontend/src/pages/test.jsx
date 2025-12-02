<div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        
                        // 🔥 SỬA: .toLowerCase() để bắt cả "mật khẩu" thường và "Mật khẩu" hoa
                        className={`pl-10 pr-10 ${
                          error.toLowerCase().includes('mật khẩu') || error.toLowerCase().includes('password')
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : ''
                        }`}
                        
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        
                        // 🔥 SỬA: Auto focus cũng dùng logic tương tự
                        autoFocus={error.toLowerCase().includes('mật khẩu')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* 🔥 SỬA: Hiển thị thông báo lỗi */}
                    {error.toLowerCase().includes('mật khẩu') || error.toLowerCase().includes('password') ? (
                      <p className="text-red-500 text-sm">{error}</p>
                    ) : null}
                  </div>