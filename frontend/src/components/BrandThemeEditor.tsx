import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Company, companyService } from '../services/company';
import { ChromePicker } from 'react-color';

interface BrandThemeEditorProps {
  company: Company;
}

const BrandThemeEditor = ({ company }: BrandThemeEditorProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: company.name,
    primary_color: company.primary_color,
    secondary_color: company.secondary_color,
    culture_video_url: company.culture_video_url || '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Company>) => companyService.updateCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', 'me'] });
      alert('Brand theme updated successfully!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { ...formData };
    if (logoFile) data.logo = logoFile;
    if (bannerFile) data.banner = bannerFile;
    updateMutation.mutate(data);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Brand Theme</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2"
              >
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: formData.primary_color }}
                />
                <span>{formData.primary_color}</span>
              </button>
              {showPrimaryPicker && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowPrimaryPicker(false)}
                  />
                  <ChromePicker
                    color={formData.primary_color}
                    onChange={(color) =>
                      setFormData({ ...formData, primary_color: color.hex })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2"
              >
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: formData.secondary_color }}
                />
                <span>{formData.secondary_color}</span>
              </button>
              {showSecondaryPicker && (
                <div className="absolute z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowSecondaryPicker(false)}
                  />
                  <ChromePicker
                    color={formData.secondary_color}
                    onChange={(color) =>
                      setFormData({ ...formData, secondary_color: color.hex })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          {company.logo_url && (
            <img
              src={company.logo_url}
              alt="Current logo"
              className="h-20 mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          {company.banner_url && (
            <img
              src={company.banner_url}
              alt="Current banner"
              className="w-full h-48 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Culture Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Culture Video URL
          </label>
          <input
            type="url"
            value={formData.culture_video_url}
            onChange={(e) =>
              setFormData({ ...formData, culture_video_url: e.target.value })
            }
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default BrandThemeEditor;

