import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Company } from '../services/company';
import {
  contentService,
  ContentSection,
  SectionType,
} from '../services/content';
import { GripVertical, Plus, Trash2, Edit2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentSectionsEditorProps {
  company: Company;
}

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: 'about', label: 'About Us' },
  { value: 'life', label: 'Life at Company' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'values', label: 'Values' },
  { value: 'mission', label: 'Mission' },
  { value: 'custom', label: 'Custom' },
];

function SortableSection({
  section,
  onEdit,
  onDelete,
}: {
  section: ContentSection;
  onEdit: (section: ContentSection) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-start gap-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mt-1"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </button>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{section.title}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {SECTION_TYPES.find((t) => t.value === section.section_type)?.label}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{section.content}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(section)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const ContentSectionsEditor = ({ company }: ContentSectionsEditorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading, error } = useQuery({
    queryKey: ['content-sections'],
    queryFn: () => contentService.getSections(),
    retry: 1,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createMutation = useMutation({
    mutationFn: contentService.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
      setShowModal(false);
    },
    onError: (error: any) => {
      console.error('Error creating section:', error);
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.detail ||
                          Object.values(error?.response?.data || {}).flat().join(', ') ||
                          'Failed to create section. Please try again.';
      alert(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ContentSection> }) =>
      contentService.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
      setEditingSection(null);
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Error updating section:', error);
      alert('Failed to update section. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contentService.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
    },
    onError: (error) => {
      console.error('Error deleting section:', error);
      alert('Failed to delete section. Please try again.');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: contentService.reorderSections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
    },
    onError: (error) => {
      console.error('Error reordering sections:', error);
      alert('Failed to reorder sections. Please try again.');
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      reorderMutation.mutate(newSections.map((s) => s.id));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      section_type: formData.get('section_type') as SectionType,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      order: editingSection
        ? editingSection.order
        : sections.length > 0
        ? Math.max(...sections.map((s) => s.order)) + 1
        : 0,
      is_active: true,
    };

    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, data });
    } else {
      createMutation.mutate(data as any);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">Loading sections...</div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as any)?.response?.data?.error || 
                         (error as any)?.message || 
                         'Unknown error occurred';
    
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <p className="font-semibold mb-2">Error loading sections</p>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['content-sections'] })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Content Sections</h2>
        <button
          onClick={() => {
            setEditingSection(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No sections yet. Add your first section!
            </p>
          ) : (
            sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onEdit={(s) => {
                  setEditingSection(s);
                  setShowModal(true);
                }}
                onDelete={(id) => {
                  if (confirm('Are you sure you want to delete this section?')) {
                    deleteMutation.mutate(id);
                  }
                }}
              />
            ))
          )}
        </SortableContext>
      </DndContext>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingSection ? 'Edit Section' : 'Add Section'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type
                </label>
                <select
                  name="section_type"
                  defaultValue={editingSection?.section_type || 'about'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {SECTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSection?.title || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  defaultValue={editingSection?.content || ''}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingSection ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSection(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentSectionsEditor;

