package com.hadithhouse.api;

import java.util.List;

/**
 * Data contract for paged responses from Hadith House APIs.
 * @param <T> The type of the content.
 */
public class PagedResults<T> {
    /**
     * The total number of available results across all pages.
     */
    public int count;

    /**
     * A string containing the URL to retrieve the next page of results.
     */
    public String next;

    /**
     * A string containing teh URL to retrieve the previous page of results.
     */
    public String previous;

    /**
     * A list containing the results of this page.
     */
    public List<T> results;
}
