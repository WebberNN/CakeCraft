import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ThemeSettings {
  primary: string;
  variant: 'professional' | 'tint' | 'vibrant';
  appearance: 'light' | 'dark' | 'system';
  radius: number;
}

const ThemeSettingsForm = () => {
  const { toast } = useToast();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primary: '#FF82A9',
    variant: 'tint',
    appearance: 'light',
    radius: 0.5,
  });
  const [isPending, setIsPending] = useState(false);

  // Load current theme settings
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setIsPending(true);
        const response = await fetch('/theme.json');
        const data = await response.json();
        setThemeSettings(data);
      } catch (error) {
        console.error('Failed to load theme settings', error);
      } finally {
        setIsPending(false);
      }
    };

    fetchTheme();
  }, []);

  const updateThemeMutation = useMutation({
    mutationFn: async (data: ThemeSettings) => {
      const res = await apiRequest('POST', '/api/admin/theme', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Theme updated',
        description: 'Theme settings have been updated successfully. Refresh the page to see changes.',
      });
      
      // Prompt to reload the page to apply the new theme
      setTimeout(() => {
        if (window.confirm('Reload the page to apply theme changes?')) {
          window.location.reload();
        }
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update theme settings. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateThemeMutation.mutate(themeSettings);
  };

  const isDisabled = isPending || updateThemeMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="primary-color">Primary Color</Label>
        <div className="flex space-x-3 mt-1.5">
          <Input
            id="primary-color"
            type="color"
            value={themeSettings.primary}
            onChange={(e) => setThemeSettings({ ...themeSettings, primary: e.target.value })}
            className="w-16 h-10 p-0.5"
            disabled={isDisabled}
          />
          <Input
            type="text"
            value={themeSettings.primary}
            onChange={(e) => setThemeSettings({ ...themeSettings, primary: e.target.value })}
            placeholder="#FF82A9"
            className="flex-1"
            disabled={isDisabled}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="variant">Color Variant</Label>
        <Select
          value={themeSettings.variant}
          onValueChange={(value: 'professional' | 'tint' | 'vibrant') => 
            setThemeSettings({ ...themeSettings, variant: value })
          }
          disabled={isDisabled}
        >
          <SelectTrigger id="variant" className="mt-1.5">
            <SelectValue placeholder="Select a variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="tint">Tint</SelectItem>
            <SelectItem value="vibrant">Vibrant</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="appearance">Appearance</Label>
        <Select
          value={themeSettings.appearance}
          onValueChange={(value: 'light' | 'dark' | 'system') => 
            setThemeSettings({ ...themeSettings, appearance: value })
          }
          disabled={isDisabled}
        >
          <SelectTrigger id="appearance" className="mt-1.5">
            <SelectValue placeholder="Select appearance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="radius">Border Radius</Label>
        <div className="pt-5 pb-2">
          <Slider
            disabled={isDisabled}
            defaultValue={[themeSettings.radius]}
            max={1.5}
            step={0.1}
            onValueChange={(value) => setThemeSettings({ ...themeSettings, radius: value[0] })}
            className="mt-1.5"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Squared</span>
          <span>Rounded</span>
          <span>Pill</span>
        </div>
      </div>
      
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-4">
          Preview of theme with radius {themeSettings.radius.toFixed(1)} and primary color:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div 
            className="h-10 rounded flex items-center justify-center text-white font-medium"
            style={{ 
              backgroundColor: themeSettings.primary,
              borderRadius: `${themeSettings.radius * 0.5 + 0.25}rem` 
            }}
          >
            Primary
          </div>
          <div 
            className="h-10 rounded flex items-center justify-center border-2 font-medium"
            style={{ 
              borderColor: themeSettings.primary,
              color: themeSettings.primary,
              borderRadius: `${themeSettings.radius * 0.5 + 0.25}rem` 
            }}
          >
            Outline
          </div>
          <div 
            className="h-10 rounded flex items-center justify-center text-gray-700 font-medium"
            style={{ 
              backgroundColor: `${themeSettings.primary}22`,
              borderRadius: `${themeSettings.radius * 0.5 + 0.25}rem` 
            }}
          >
            Light
          </div>
          <div 
            className="h-10 rounded flex items-center justify-center text-white font-medium"
            style={{ 
              backgroundColor: `${themeSettings.primary}dd`,
              borderRadius: `${themeSettings.radius * 0.5 + 0.25}rem` 
            }}
          >
            Dark
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isDisabled} 
        className="w-full"
        style={{ 
          backgroundColor: themeSettings.primary,
          borderRadius: `${themeSettings.radius * 0.5 + 0.25}rem` 
        }}
      >
        {isDisabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Theme Settings
      </Button>
    </form>
  );
};

export default ThemeSettingsForm;