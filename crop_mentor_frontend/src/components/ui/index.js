// src/components/ui/Card.jsx
export const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ icon: Icon, title, action }) => (
  <div className="p-4 bg-green-50/50 border-b border-green-100 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-green-600" />}
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {action}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// src/components/ui/StatCard.jsx
export const StatCard = ({ icon: Icon, title, value, description, trend, trendUp }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {trend && (
          <p className={`text-sm font-medium mt-2 ${trendUp ? 'text-red-600' : 'text-green-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
    </div>
  </Card>
);

// src/components/ui/Progress.jsx
export const Progress = ({ value, className = "", color = "green" }) => {
  const colorClasses = {
    green: 'from-green-500 to-green-400',
    teal: 'from-teal-500 to-teal-400',
    cyan: 'from-cyan-500 to-cyan-400',
    blue: 'from-blue-500 to-blue-400'
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

// src/components/ui/Input.jsx
export const Input = ({ label, error, icon: Icon, ...props }) => (
  <div className="flex flex-col">
    {label && (
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
          Icon ? 'pl-10' : ''
        } ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

// src/components/ui/Button.jsx
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled, 
  loading,
  icon: Icon,
  className = "",
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
    ghost: 'text-green-600 hover:bg-green-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

// src/components/ui/Badge.jsx
export const Badge = ({ children, variant = 'default', className = "" }) => {
  const variants = {
    default: 'bg-green-600 text-white',
    secondary: 'bg-teal-600 text-white',
    outline: 'border-2 border-gray-300 text-gray-700 bg-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// src/components/ui/Alert.jsx
export const Alert = ({ children, type = 'info', icon: Icon, className = "" }) => {
  const types = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    success: 'bg-green-50 border-green-500 text-green-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    error: 'bg-red-50 border-red-500 text-red-800'
  };

  return (
    <div className={`p-4 border-l-4 rounded ${types[type]} ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

// src/components/ui/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = 'md', className = "" }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-b-4 border-green-600 ${sizes[size]} ${className}`}></div>
  );
};

// src/components/ui/EmptyState.jsx
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
    {title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>}
    {description && <p className="text-gray-500 max-w-md mb-4">{description}</p>}
    {action}
  </div>
);

// src/components/ui/Select.jsx
export const Select = ({ label, options = [], error, ...props }) => (
  <div className="flex flex-col">
    {label && (
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    )}
    <select
      className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    >
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

// Export all components
export default {
  Card,
  CardHeader,
  CardContent,
  StatCard,
  Progress,
  Input,
  Button,
  Badge,
  Alert,
  LoadingSpinner,
  EmptyState,
  Select
};