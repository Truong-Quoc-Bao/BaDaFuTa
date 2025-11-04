import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Edit, Trash2, Check, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchant } from '../contexts/MerchantContext';
import { toppingGroups as mockToppingGroups, menuItems as mockMenuItems } from '../data/mockData';

function CreateToppingDialog({ open, onOpenChange, onSave }) {
  const [step, setStep] = useState('name');
  const [groupName, setGroupName] = useState('');
  const [toppingItems, setToppingItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [required, setRequired] = useState(false);
  const [linkedMenuItems, setLinkedMenuItems] = useState([]);

  const resetForm = () => {
    setStep('name');
    setGroupName('');
    setToppingItems([]);
    setNewItemName('');
    setNewItemPrice('');
    setRequired(false);
    setLinkedMenuItems([]);
  };

  const handleAddToppingItem = () => {
    if (!newItemName.trim() || !newItemPrice.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên và giá món thêm');
      return;
    }

    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Giá món thêm không hợp lệ');
      return;
    }

    const newItem = {
      id: `ti_${Date.now()}`,
      name: newItemName.trim(),
      price: price
    };

    setToppingItems([...toppingItems, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    toast.success('Đã thêm món thêm');
  };

  const handleRemoveToppingItem = (itemId) => {
    setToppingItems(toppingItems.filter(item => item.id !== itemId));
  };

  const handleMenuItemToggle = (menuItemId) => {
    setLinkedMenuItems(prev => 
      prev.includes(menuItemId) 
        ? prev.filter(id => id !== menuItemId)
        : [...prev, menuItemId]
    );
  };

  const handleNextStep = () => {
    if (step === 'name') {
      if (!groupName.trim()) {
        toast.error('Vui lòng nhập tên nhóm topping');
        return;
      }
      setStep('items');
    } else if (step === 'items') {
      if (toppingItems.length === 0) {
        toast.error('Vui lòng thêm ít nhất một món thêm');
        return;
      }
      setStep('permission');
    } else if (step === 'permission') {
      setStep('link');
    }
  };

  const handleSave = () => {
    if (linkedMenuItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một món ăn để liên kết');
      return;
    }

    const newToppingGroup = {
      name: groupName,
      items: toppingItems,
      required,
      linkedMenuItemIds: linkedMenuItems,
      restaurantId: 'rest1' // Mock restaurant ID
    };

    onSave(newToppingGroup);
    resetForm();
    onOpenChange(false);
    toast.success('Đã tạo nhóm topping thành công');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'name': return 'Nhập tên nhóm';
      case 'items': return 'Thêm món thêm';
      case 'permission': return 'Quyền tùy chọn';
      case 'link': return 'Liên kết món ăn';
      default: return '';
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 'name': return groupName.trim().length > 0;
      case 'items': return toppingItems.length > 0;
      case 'permission': return true;
      case 'link': return linkedMenuItems.length > 0;
      default: return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm nhóm topping mới</DialogTitle>
          <DialogDescription>
            {getStepTitle()} - Bước {
              step === 'name' ? 1 : step === 'items' ? 2 : step === 'permission' ? 3 : 4
            } / 4
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Tên nhóm */}
          {step === 'name' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Tên nhóm topping</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="VD: Tương, Độ cay, Topping thêm..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Món thêm */}
          {step === 'items' && (
            <div className="space-y-4">
              <div>
                <h4>Danh sách món thêm hiện tại</h4>
                <div className="space-y-2 mt-2">
                  {toppingItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">
                          {item.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveToppingItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
              
              <div>
                <h4>Thêm món thêm mới</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="itemName">Tên món thêm</Label>
                    <Input
                      id="itemName"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="VD: Tương cà, Không cay..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemPrice">Giá (VND)</Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddToppingItem}
                  className="mt-3"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm món thêm
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Quyền tùy chọn */}
          {step === 'permission' && (
            <div className="space-y-4">
              <div>
                <Label>Quyền tùy chọn</Label>
                <RadioGroup
                  value={required ? 'required' : 'optional'}
                  onValueChange={(value) => setRequired(value === 'required')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="required" id="required" />
                    <Label htmlFor="required">Bắt buộc chọn</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="optional" id="optional" />
                    <Label htmlFor="optional">Không bắt buộc</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 4: Liên kết món ăn */}
          {step === 'link' && (
            <div className="space-y-4">
              <div>
                <Label>Chọn món ăn để liên kết với nhóm topping này</Label>
                <div className="space-y-3 mt-3 max-h-60 overflow-y-auto">
                  {mockMenuItems.map((menuItem) => (
                    <div key={menuItem.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={menuItem.id}
                        checked={linkedMenuItems.includes(menuItem.id)}
                        onCheckedChange={() => handleMenuItemToggle(menuItem.id)}
                      />
                      <Label htmlFor={menuItem.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span>{menuItem.name}</span>
                          <span className="text-sm text-gray-500">
                            {menuItem.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{menuItem.category}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 'name') {
                  onOpenChange(false);
                } else {
                  const steps = ['name', 'items', 'permission', 'link'];
                  const currentIndex = steps.indexOf(step);
                  setStep(steps[currentIndex - 1]);
                }
              }}
            >
              {step === 'name' ? 'Hủy' : 'Quay lại'}
            </Button>

            <Button
              onClick={step === 'link' ? handleSave : handleNextStep}
              disabled={!canGoNext()}
            >
              {step === 'link' ? 'Lưu' : 'Tiếp tục'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ToppingGroupManagementPage() {
  const [toppingGroups, setToppingGroups] = useState(mockToppingGroups);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { merchantAuth } = useMerchant();

  // Filter topping groups based on search term
  const filteredToppingGroups = toppingGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateToppingGroup = (newGroup) => {
    const toppingGroup = {
      ...newGroup,
      id: `tg_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setToppingGroups([...toppingGroups, toppingGroup]);
  };

  const handleDeleteToppingGroup = (groupId) => {
    setToppingGroups(toppingGroups.filter(group => group.id !== groupId));
    toast.success('Đã xóa nhóm topping');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Quản lý nhóm topping</h2>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các nhóm topping cho món ăn của bạn
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm topping
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm nhóm topping..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Topping Groups Table */}
      <Card>
        <CardContent className="p-0">
          {filteredToppingGroups.length === 0 ? (
            <div className="text-center py-12">
              {toppingGroups.length === 0 ? (
                <>
                  <p className="text-gray-500">Chưa có nhóm topping nào</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo nhóm topping đầu tiên
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">Không tìm thấy nhóm topping phù hợp</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nhóm</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Món thêm</TableHead>
                  <TableHead>Món liên kết</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredToppingGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      {group.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={group.required ? "destructive" : "secondary"}>
                        {group.required ? 'Bắt buộc' : 'Tùy chọn'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-600 mb-1">
                          {group.items.length} món thêm
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {group.items.slice(0, 2).map((item) => (
                            <Badge key={item.id} variant="outline" className="text-xs">
                              {item.name}
                            </Badge>
                          ))}
                          {group.items.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.items.length - 2} khác
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-600 mb-1">
                          {group.linkedMenuItemIds.length} món ăn
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {group.linkedMenuItemIds.slice(0, 2).map((menuItemId) => {
                            const menuItem = mockMenuItems.find(item => item.id === menuItemId);
                            return menuItem ? (
                              <Badge key={menuItemId} variant="secondary" className="text-xs">
                                {menuItem.name}
                              </Badge>
                            ) : null;
                          })}
                          {group.linkedMenuItemIds.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{group.linkedMenuItemIds.length - 2} khác
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(group.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteToppingGroup(group.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Topping Dialog */}
      <CreateToppingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateToppingGroup}
      />
    </div>
  );
}