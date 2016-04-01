from rest_framework.filters import BaseFilterBackend


class IdsFilter(BaseFilterBackend):
  """
  Filter that only allows users to see their own objects.
  """
  def filter_queryset(self, request, queryset, view):
    ids_str = request.query_params.get('id', None)
    if ids_str is None:
      return queryset
    ids = [int(id.strip()) for id in ids_str.split(',') if id.strip()]
    if len(ids) == 0:
      return queryset
    filtered_queryset = queryset.filter(id__in=ids)
    return filtered_queryset


class TagsFilter(BaseFilterBackend):
  """
  Filter that only allows users to see their own objects.
  """
  def filter_queryset(self, request, queryset, view):
    tags_str = request.query_params.get('tags', None)
    if tags_str is None:
      return queryset
    tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
    if len(tags) == 0:
      return queryset
    filtered_queryset = queryset
    for tag in tags:
      filtered_queryset = filtered_queryset.filter(tag_rels__tag=tag)
    return filtered_queryset