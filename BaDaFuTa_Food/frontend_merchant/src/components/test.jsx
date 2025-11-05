<header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className="p-2"
    >
      <PanelLeft className="w-4 h-4" />
</Button>
    <div>
      <h1 className="text-base font-semibold text-gray-900">
        {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
      </h1>
      <p className="text-xs text-gray-600">
        Quản lý nhà hàng và đơn hàng của bạn
      </p>
    </div>
  </div>
</header>
