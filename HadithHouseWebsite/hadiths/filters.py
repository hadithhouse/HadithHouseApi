from rest_framework.filters import BaseFilterBackend


class TagsFilter(BaseFilterBackend):
  """
  Filter that only allows users to see their own objects.
  """
  def filter_queryset(self, request, queryset, view):
    tags_str = request.query_params.get('tags', None)
    if tags_str is None:
      return queryset
    tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
    filtered_queryset = queryset
    for tag in tags:
      filtered_queryset = filtered_queryset.filter(tags__name=tag)
    return filtered_queryset