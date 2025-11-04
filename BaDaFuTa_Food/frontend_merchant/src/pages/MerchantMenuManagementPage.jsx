import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { useMerchant } from '../contexts/MerchantContext';
import { menuItems } from '../data/mockData';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Menu as MenuIcon, Tag, Eye, EyeOff, Save, X } from 'lucide-react';

export function MerchantMenuManagementPage() {
  const { merchantSettings } = useMerchant();
  const [activeTab, setActiveTab] = useState('dishes');
  const [menuList, setMenuList] = useState([]);
  const [toppingGroups, setToppingGroups] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showToppingDialog, setShowToppingDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedToppingGroup, setSelectedToppingGroup] = useState(null);

  // Form states for menu item
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    ingredients: '',
    allergens: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Form states for topping group
  const [toppingFormData, setToppingFormData] = useState({
    name: '',
    description: '',
    toppings: []
  });

  useEffect(() => {
    // Load menu items for current restaurant
    const restaurantId = merchantSettings.restaurantId;
    const restaurantMenuItems = menuItems.filter(
      item => item.restaurantId === restaurantId
    );
    setMenuList(restaurantMenuItems);

    // Load mock topping groups
    const mockToppingGroups = [
      {
        id: '1',
        name: 'Size Phở',
        description: 'Lựa chọn size cho món phở',
        restaurantId: restaurantId,
        toppings: [
          { id: 'size_small', name: 'Size nhỏ', price: 0, required: true },
          { id: 'size_medium', name: 'Size vừa', price: 15000, required: true },
          { id: 'size_large', name: 'Size lớn', price: 25000, required: true }
        ]
      },
      {
        id: '2',
        name: 'Thêm topping',
        description: 'Các loại topping bổ sung',
        restaurantId: restaurantId,
        toppings: [
          { id: 'extra_meat', name: 'Thêm thịt', price: 25000 },
          { id: 'extra_noodles', name: 'Thêm bánh phở', price: 15000 },
          { id: 'side_herbs', name: 'Rau thơm thêm', price: 10000 }
        ]
      }
    ];
    setToppingGroups(mockToppingGroups);
  }, [merchantSettings?.restaurantId]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      ingredients: '',
      allergens: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
  };

  const resetToppingForm = () => {
    setToppingFormData({
      name: '',
      description: '',
      toppings: []
    });
  };

  const handleAddItem = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const newItem = {
      id: `new_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      restaurantId: merchantSettings.restaurantId,
      isAvailable: true,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
      allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a),
      nutrition: {
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        protein: formData.protein ? parseInt(formData.protein) : undefined,
        carbs: formData.carbs ? parseInt(formData.carbs) : undefined,
        fat: formData.fat ? parseInt(formData.fat) : undefined
      }
    };

    setMenuList(prev => [...prev, newItem]);
    setShowAddDialog(false);
    resetForm();
    toast.success('Đã thêm món ăn mới thành công!');
  };

  const handleEditItem = () => {
    if (!selectedItem || !formData.name || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const updatedItem = {
      ...selectedItem,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || selectedItem.image,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
      allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a),
      nutrition: {
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        protein: formData.protein ? parseInt(formData.protein) : undefined,
        carbs: formData.carbs ? parseInt(formData.carbs) : undefined,
        fat: formData.fat ? parseInt(formData.fat) : undefined
      }
    };

    setMenuList(prev => 
      prev.map(item => item.id === selectedItem.id ? updatedItem : item)
    );
    setShowEditDialog(false);
    setSelectedItem(null);
    resetForm();
    toast.success('Đã cập nhật món ăn thành công!');
  };

  const openEditDialog = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      ingredients: item.ingredients?.join(', ') || '',
      allergens: item.allergens?.join(', ') || '',
      calories: item.nutrition?.calories?.toString() || '',
      protein: item.nutrition?.protein?.toString() || '',
      carbs: item.nutrition?.carbs?.toString() || '',
      fat: item.nutrition?.fat?.toString() || ''
    });
    setShowEditDialog(true);
  };

  const toggleItemAvailability = (itemId) => {
    setMenuList(prev =>
      prev.map(item =>
        item.id === itemId 
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
    const item = menuList.find(i => i.id === itemId);
    toast.success(
      `Đã ${item?.isAvailable ? 'tắt' : 'bật'} món "${item?.name}"`
    );
  };

  const deleteItem = (itemId) => {
    const item = menuList.find(i => i.id === itemId);
    setMenuList(prev => prev.filter(item => item.id !== itemId));
    toast.success(`Đã xóa món "${item?.name}"`);
  };

  const addToppingToGroup = () => {
    const newTopping = {
      id: `topping_${Date.now()}`,
      name: 'Tên topping',
      price: 0
    };
    setToppingFormData(prev => ({
      ...prev,
      toppings: [...prev.toppings, newTopping]
    }));
  };

  const updateTopping = (index, field, value) => {
    setToppingFormData(prev => ({
      ...prev,
      toppings: prev.toppings.map((topping, i) => 
        i === index ? { ...topping, [field]: value } : topping
      )
    }));
  };

  const removeTopping = (index) => {
    setToppingFormData(prev => ({
      ...prev,
      toppings: prev.toppings.filter((_, i) => i !== index)
    }));
  };

  const handleAddToppingGroup = () => {
    if (!toppingFormData.name) {
      toast.error('Vui lòng nhập tên nhóm topping');
      return;
    }

    const newGroup = {
      id: `group_${Date.now()}`,
      name: toppingFormData.name,
      description: toppingFormData.description,
      restaurantId: merchantSettings.restaurantId,
      toppings: toppingFormData.toppings
    };

    setToppingGroups(prev => [...prev, newGroup]);
    setShowToppingDialog(false);
    resetToppingForm();
    toast.success('Đã thêm nhóm topping mới!');
  };

  const deleteToppingGroup = (groupId) => {
    const group = toppingGroups.find(g => g.id === groupId);
    setToppingGroups(prev => prev.filter(group => group.id !== groupId));
    toast.success(`Đã xóa nhóm topping "${group?.name}"`);
  };

  const categories = [...new Set(menuList.map(item => item.category))];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quản lý thực đơn</h1>
        <p className="text-muted-foreground">
          Quản lý món ăn và nhóm topping của nhà hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng món ăn</CardTitle>
            <MenuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuList.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {menuList.filter(item => item.isAvailable !== false).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhóm topping</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toppingGroups.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dishes">Món ăn</TabsTrigger>
          <TabsTrigger value="toppings">Nhóm topping</TabsTrigger>
        </TabsList>

        {/* Dishes Tab */}
        <TabsContent value="dishes" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Danh sách món ăn</h2>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto mx-auto p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle>Thêm món ăn mới</DialogTitle>
                    <DialogDescription>
                      Điền thông tin để thêm món ăn mới vào thực đơn của nhà hàng.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Tên món ăn *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nhập tên món ăn"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Giá *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Danh mục *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                          <SelectItem value="Món mới">Món mới</SelectItem>
                          <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                          <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Mô tả món ăn"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">URL hình ảnh</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="ingredients">Nguyên liệu (phân cách bằng dấu phẩy)</Label>
                      <Textarea
                        id="ingredients"
                        value={formData.ingredients}
                        onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                        placeholder="Thịt bò, Bánh phở, Hành lá..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens">Chất gây dị ứng (phân cách bằng dấu phẩy)</Label>
                      <Input
                        id="allergens"
                        value={formData.allergens}
                        onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
                        placeholder="Gluten, Đậu nành..."
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="calories">Calories</Label>
                        <Input
                          id="calories"
                          type="number"
                          value={formData.calories}
                          onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input
                          id="protein"
                          type="number"
                          value={formData.protein}
                          onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input
                          id="carbs"
                          type="number"
                          value={formData.carbs}
                          onChange={(e) => setFormData(prev => ({ ...prev, carbs: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input
                          id="fat"
                          type="number"
                          value={formData.fat}
                          onChange={(e) => setFormData(prev => ({ ...prev, fat: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                    <Button onClick={handleAddItem}>
                      <Save className="w-4 h-4 mr-2" />
                      Thêm món
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuList.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant={item.isAvailable !== false ? "default" : "secondary"}>
                        {item.isAvailable !== false ? "Còn hàng" : "Hết hàng"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="font-bold text-lg text-orange-600">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isAvailable !== false}
                          onCheckedChange={() => toggleItemAvailability(item.id)}
                        />
                        <span className="text-sm">
                          {item.isAvailable !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa món ăn</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa món "{item.name}"? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteItem(item.id)}>
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {menuList.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Chưa có món ăn nào trong thực đơn</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Toppings Tab */}
        <TabsContent value="toppings" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Nhóm topping</h2>
              <Dialog open={showToppingDialog} onOpenChange={setShowToppingDialog}>
                <DialogTrigger asChild>
                  <Button onClick={resetToppingForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm nhóm topping
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto mx-auto p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle>Thêm nhóm topping</DialogTitle>
                    <DialogDescription>
                      Tạo nhóm topping mới với các tùy chọn bổ sung cho món ăn.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="group-name">Tên nhóm *</Label>
                      <Input
                        id="group-name"
                        value={toppingFormData.name}
                        onChange={(e) => setToppingFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ví dụ: Size, Topping thêm..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="group-description">Mô tả</Label>
                      <Input
                        id="group-description"
                        value={toppingFormData.description}
                        onChange={(e) => setToppingFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Mô tả ngắn về nhóm topping"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Danh sách topping</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addToppingToGroup}>
                          <Plus className="w-4 h-4 mr-1" />
                          Thêm
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {toppingFormData.toppings.map((topping, index) => (
                          <div key={index} className="flex gap-2 items-center p-2 border rounded">
                            <Input
                              placeholder="Tên topping"
                              value={topping.name}
                              onChange={(e) => updateTopping(index, 'name', e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Giá"
                              className="w-24"
                              value={topping.price}
                              onChange={(e) => updateTopping(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={topping.required || false}
                                onChange={(e) => updateTopping(index, 'required', e.target.checked)}
                              />
                              <span className="text-xs">Bắt buộc</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTopping(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowToppingDialog(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                    <Button onClick={handleAddToppingGroup}>
                      <Save className="w-4 h-4 mr-2" />
                      Tạo nhóm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Topping Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toppingGroups.map(group => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {group.description}
                          </p>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa nhóm topping</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa nhóm topping "{group.name}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteToppingGroup(group.id)}>
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {group.toppings.map(topping => (
                        <div key={topping.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span>{topping.name}</span>
                            {topping.required && (
                              <Badge variant="secondary" className="text-xs">Bắt buộc</Badge>
                            )}
                          </div>
                          <span className="font-medium">
                            {topping.price > 0 ? formatCurrency(topping.price) : 'Miễn phí'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {toppingGroups.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Chưa có nhóm topping nào</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin món ăn trong thực đơn của nhà hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Tên món ăn *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên món ăn"
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Giá *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-category">Danh mục *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="Món mới">Món mới</SelectItem>
                  <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                  <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả món ăn"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-image">URL hình ảnh</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="edit-ingredients">Nguyên liệu (phân cách bằng dấu phẩy)</Label>
              <Textarea
                id="edit-ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                placeholder="Thịt bò, Bánh phở, Hành lá..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="edit-allergens">Chất gây dị ứng (phân cách bằng dấu phẩy)</Label>
              <Input
                id="edit-allergens"
                value={formData.allergens}
                onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
                placeholder="Gluten, Đậu nành..."
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="edit-calories">Calories</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-protein">Protein (g)</Label>
                <Input
                  id="edit-protein"
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-carbs">Carbs (g)</Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData(prev => ({ ...prev, carbs: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-fat">Fat (g)</Label>
                <Input
                  id="edit-fat"
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData(prev => ({ ...prev, fat: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleEditItem}>
              <Save className="w-4 h-4 mr-2" />
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}