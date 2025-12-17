// Common UI components
// Reusable components used throughout the app

export const Button = () => {
  return <button className="px-4 py-2 rounded-md">Button</button>;
};

export const Input = () => {
  return <input className="px-3 py-2 border rounded-md" />;
};

export const Modal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal component */}
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
};
