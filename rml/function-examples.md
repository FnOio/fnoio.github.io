---
layout: default
title: Function examples
nav: |
    <li class="page-scroll">
        <a href="#introduction">Introduction</a>
    </li>
    <li class="page-scroll">
        <a href="#to-uppercase">To uppercase</a>
    </li>
    <li class="page-scroll">
        <a href="#lookup">Lookup</a>
    </li>
---

<!-- Introduction -->
<section id="introduction">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
{% renderTemplate "md" %}

## Introduction

Some general purpose functions are described in RDF at <https://users.ugent.be/~bjdmeest/function/grel.ttl> and <https://w3id.org/imec/idlab/function>.
Below we show how to discover some of them and use them in a mapping file, written in [YARRRML](https://rml.io/yarrrml/) or [RML](https://rml.io/).
{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>

<!-- To uppercase -->
<section id="to-uppercase">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
{% renderTemplate "md" %}

## To uppercase

### Challenge

Make a mapping to create triples `ex:id rdfs:label "<LABEL>"`, where `<LABEL>` is the uppercase-converted value of a `label` string in the input data.

The input data is in file `vegetables.csv`, with example content:

```csv
id,label
1,BEAN
2,Carrot
3,salad
```

### How to solve

Search for a function "to uppercase".

We find one at <https://users.ugent.be/~bjdmeest/function/grel.ttl>.

The following RDF snippets at that URL inform us about the RDF terms to use in our mapping.

```turtle
grel:toUpperCase
    a                   fno:Function ;
    fno:name            "to Uppercase" ;
    rdfs:label          "to Uppercase" ;
    dcterms:description "Returns the input with all letters in upper case." ;
    fno:solves          grel:prob_ucase ;
    fno:expects         ( grel:valueParam ) ;
    fno:returns         ( grel:stringOut ) .
```

Predicate `fno:expects` provides info about the parameters of the function (more about these below).

Predicate `fno:returns` provides info about the return value of the function (more about it below).

```turtle
grel:valueParam
    a             fno:Parameter ;
    fno:name      "input value" ;
    rdfs:label    "input value" ;
    fno:predicate grel:valueParameter ;
    fno:type      xsd:string ;
    fno:required  "true"^^xsd:boolean .
```

To specify parameter `grel:valueParam`, we must use the predicate `grel:valueParameter` and the object must be of type `xsd:string`.

```turtle
grel:stringOut
    a             fno:Output ;
    fno:name      "output string" ;
    rdfs:label    "output string" ;
    fno:predicate grel:stringOutput ;
    fno:type      xsd:string .
```

The return value of the function is `xsd:string`.

### Solution

#### Mapping file in YARRRML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```yaml
prefixes:
  ex: http://www.example.com/data/
  grel: http://users.ugent.be/~bjdmeest/function/grel.ttl#
  rdfs: http://www.w3.org/2000/01/rdf-schema#

mappings:
  vegetables:
    sources:
      - ['vegetables.csv~csv']
    s:
      value: ex:$(id)
    po:
      - p: rdfs:label
        o:
          function: grel:toUpperCase
          parameters:
            - [grel:valueParameter, $(label)]
```

#### Mapping file in RML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#>.
@prefix fno: <https://w3id.org/function/ontology#>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix : <http://mapping.example.com/>.
@prefix ex: <http://www.example.com/data/>.
@prefix grel: <http://users.ugent.be/~bjdmeest/function/grel.ttl#>.

:source-vegetables a rml:LogicalSource;
  rml:source "vegetables.csv";
  rml:referenceFormulation ql:CSV.

:map-vegetables a rr:TriplesMap;
  rml:logicalSource :source-vegetables;
  rdfs:label "vegetables";
  rr:subjectMap [
    a rr:SubjectMap;
    rr:template "http://www.example.com/data/{id}"
  ];
  rr:predicateObjectMap [
    a rr:PredicateObjectMap;
    rr:predicateMap [
      a rr:PredicateMap;
      rr:constant rdfs:label
    ];
    rr:objectMap [
      a fnml:FunctionTermMap;
      rr:termType rr:Literal;
      fnml:functionValue [
        rml:logicalSource :source-vegetables;
        rr:predicateObjectMap [
          rr:predicateMap [ rr:constant fno:executes ];
          rr:objectMap [
            rr:constant "http://users.ugent.be/~bjdmeest/function/grel.ttl#toUpperCase";
            rr:termType rr:IRI
          ]
        ], [
          a rr:PredicateObjectMap;
          rr:predicateMap [
            a rr:PredicateMap;
            rr:constant grel:valueParameter
          ];
          rr:objectMap [
            a rr:ObjectMap;
            rr:termType rr:Literal;
            rml:reference "label"
          ]
        ]
      ]
    ]
  ].
```

#### Mapping engine output

```turtle
<http://www.example.com/data/1> <http://www.w3.org/2000/01/rdf-schema#label> "BEAN" .
<http://www.example.com/data/2> <http://www.w3.org/2000/01/rdf-schema#label> "CARROT" .
<http://www.example.com/data/3> <http://www.w3.org/2000/01/rdf-schema#label> "SALAD" .
```

{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>

<!-- Lookup -->
<section id="lookup">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
{% renderTemplate "md" %}

## Lookup

### Challenge

Given a list of products, each annotated with a review code in the range 0 (lowest) to 3 (highest),
make a mapping to create triples `ex:id onto:review "<review-string>"`.
`<review-string>` is one of the strings we define to present the review of a product to the public.
The review strings are based on the review code and are defined in a separate list.

The reviewed products are given in file `reviewed-products.csv`, with example content:

```csv
id,review code
1,3
2,2
3,1
4,0
```

The strings to represent a review are given in file `review-strings`.
Column 0 has the review codes; column 1 has the review strings.

```csv
0,bad
1,poor
2,good
3,excellent
```

### How to solve

Search for a function "lookup".

We find one at <https://w3id.org/imec/idlab/function>.

The following RDF snippets at that URL inform us about the RDF terms to use in our mapping.

```turtle
idlab-fn:lookup
    a                   fno:Function ;
    fno:name            "lookup" ;
    rdfs:label          "lookup" ;
    dcterms:description "Looks for the first appearance of the search string in the fromColumn of a csv file (supposing default delimiter ','), and returns the value of the toColumn on the same row.";
    fno:expects         ( idlab-fn:_str idlab-fn:_inputFile idlab-fn:_fromColumn idlab-fn:_toColumn) ;
    fno:returns         ( idlab-fn:_stringOut ) .
```

Predicate `fno:expects` provides info about the parameters of the function (more about these below).

Predicate `fno:returns` provides info about the return value of the function (more about it below).

```turtle
idlab-fn:_str
    a             fno:Parameter ;
    fno:name      "input string" ;
    rdfs:label    "input string" ;
    fno:type      xsd:string ;
    fno:predicate idlab-fn:str .
```

To specify parameter `idlab-fn:_str`, we must use the predicate `idlab-fn:str` and the object must be of type `xsd:string`.

```turtle
idlab-fn:_inputFile
    a             fno:Parameter;
    fno:name      "string representing the path to an input file";
    rdfs:label    "string representing the path to an input file";
    fno:type      xsd:string ;
    fno:predicate idlab-fn:inputFile .
```

To specify parameter `idlab-fn:_inputFile`, we must use the predicate `idlab-fn:inputFile` and the object must be of type `xsd:string`.

```turtle
idlab-fn:_fromColumn
    a             fno:Parameter;
    fno:name      "index of the fromColumn";
    rdfs:label    "index of the fromColumn";
    fno:type      xsd:int ;
    fno:predicate idlab-fn:fromColumn .
```

To specify parameter `idlab-fn:_fromColumn`, we must use the predicate `idlab-fn:fromColumn` and the object must be of type `xsd:int`.

```turtle
idlab-fn:_toColumn
    a             fno:Parameter;
    fno:name      "index of the toColumn";
    rdfs:label    "index of the toColumn";
    fno:type      xsd:int ;
    fno:predicate idlab-fn:toColumn .
```

To specify parameter `idlab-fn:_toColumn`, we must use the predicate `idlab-fn:toColumn` and the object must be of type `xsd:int`.

```turtle
idlab-fn:_stringOut
    a             fno:Output ;
    fno:name      "output string" ;
    rdfs:label    "output string" ;
    fno:type      xsd:string ;
    fno:predicate idlab-fn:stringOut .
```

The return value of the function is `xsd:string`.

### Solution

#### Mapping file in YARRRML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```yaml
prefixes:
  ex: http://www.example.com/data/
  onto: http://www.example.com/ontology/
  idlab-fn: https://w3id.org/imec/idlab/function#

mappings:
  reviews:
    sources:
      - ['reviewed-products.csv~csv']
    s:
      value: ex:$(id)
    po:
      - p: onto:review
        o:
          function: idlab-fn:lookup
          parameters:
            - [idlab-fn:str, $(review code)]
            - [idlab-fn:inputFile, 'review-strings.csv']
            - [idlab-fn:fromColumn, 0]
            - [idlab-fn:toColumn, 1]
```

#### Mapping file in RML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#>.
@prefix fno: <https://w3id.org/function/ontology#>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix : <http://mapping.example.com/>.
@prefix ex: <http://www.example.com/data/>.
@prefix onto: <http://www.example.com/ontology/>.
@prefix idlab-fn: <https://w3id.org/imec/idlab/function#>.

:source-reviewed-products a rml:LogicalSource;
  rml:source "reviewed-products.csv";
  rml:referenceFormulation ql:CSV.

:map-reviewed-products a rr:TriplesMap;
  rml:logicalSource :source-reviewed-products;
  rdfs:label "reviews";
  rr:subjectMap [
    a rr:SubjectMap;
    rr:template "http://www.example.com/data/{id}"
  ];
  rr:predicateObjectMap [
    a rr:PredicateObjectMap;
    rr:predicateMap [
      a rr:PredicateMap;
      rr:constant onto:review
    ];
    rr:objectMap [
      a fnml:FunctionTermMap;
      rr:termType rr:Literal;
      fnml:functionValue [
        rml:logicalSource :source-reviewed-products;
        rr:predicateObjectMap [
          rr:predicateMap [ rr:constant fno:executes ];
          rr:objectMap [
            rr:constant "https://w3id.org/imec/idlab/function#lookup";
            rr:termType rr:IRI
          ]
        ], [
          a rr:PredicateObjectMap;
          rr:predicateMap [
            a rr:PredicateMap;
            rr:constant idlab-fn:str
          ];
          rr:objectMap [
            a rr:ObjectMap;
            rr:termType rr:Literal;
            rml:reference "review code"
          ]
        ], [
          a rr:PredicateObjectMap;
          rr:predicateMap [
            a rr:PredicateMap;
            rr:constant idlab-fn:inputFile
          ];
          rr:objectMap [
            a rr:ObjectMap;
            rr:constant "review-strings.csv";
            rr:termType rr:Literal
          ]
        ], [
          a rr:PredicateObjectMap;
          rr:predicateMap [
            a rr:PredicateMap;
            rr:constant idlab-fn:fromColumn
          ];
          rr:objectMap [
            a rr:ObjectMap;
            rr:constant "0";
            rr:termType rr:Literal
          ]
        ], [
          a rr:PredicateObjectMap;
          rr:predicateMap [
            a rr:PredicateMap;
            rr:constant idlab-fn:toColumn
          ];
          rr:objectMap [
            a rr:ObjectMap;
            rr:constant "1";
            rr:termType rr:Literal
          ]
        ]
      ]
    ]
  ].
```

#### Mapping engine output

```turtle
<http://www.example.com/data/1> <http://www.example.com/ontology/review> "excellent" .
<http://www.example.com/data/2> <http://www.example.com/ontology/review> "good" .
<http://www.example.com/data/3> <http://www.example.com/ontology/review> "poor" .
<http://www.example.com/data/4> <http://www.example.com/ontology/review> "bad" .
```

{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>

<!-- Lookup -->
<section id="lookup">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
{% renderTemplate "md" %}


## CrossConcatSequence

### Challenge

Students take classes, list wich classes each student takes. Make triples
`<STUDENT> ex:takesClasses ex:<CLASS A>, ex:<CLASS B>, ...` .

The input is a csv file `classes.csv`:
```csv
Student,Classes
Alice,Math;Programming;Databases
Bob,German;French
```

### How to solve

First the `Classes` column needs to be split by `;`.
We use the function <http://users.ugent.be/~bjdmeest/function/grel.ttl#string_split> :

```turtle
grel:string_split
    a                   fno:Function ;
    fno:name            "split" ;
    dcterms:description "split" ;
    fno:expects         ( grel:valueParam grel:param_string_sep ) ;
    fno:returns         ( grel:output_array ) .
```

Predicate `fno:expects` provides info about the parameters of the function (more about these below).

Predicate `fno:returns` provides info about the return value of the function (more about it below).

```turtle
grel:valueParam
    a             fno:Parameter ;
    fno:name      "input value" ;
    rdfs:label    "input value" ;
    fno:predicate grel:valueParameter ;
    fno:type      xsd:string ;
    fno:required  "true"^^xsd:boolean .
```
```turtle
grel:param_string_sep
    a             fno:Parameter ;
    fno:name      "sep" ;
    rdfs:label    "sep" ;
    fno:predicate grel:p_string_sep ;
    fno:type      xsd:string ;
    fno:required  "true"^^xsd:boolean .
```

To specify parameter `grel:valueParam`, we must use the predicate `grel:valueParameter` and the object must be of type `xsd:string`.
To specify parameter `grel:param_string_sep`, we must use the predicate `grel:p_string_sep` and the object must be of type `xsd:string`.

```turtle
grel:output_array
    a             fno:Output ;
    fno:name      "array" ;
    rdfs:label    "array" ;
    fno:predicate grel:o_array ;
    fno:type      rdf:List .
```
The return value of the function is `rdf:List`.

Then, we need to concatenate the list of classes to the `ex:` prefix.
So this means concatenating a string to a list by combining the string with each element of the list.
This can be obtained by using the function <https://w3id.org/imec/idlab/function#crossConcatSequence> .
It takes a sequence of lists as input, and combines each element of each list.

For example, if the input lists are
```
("Have a", "I wish you a"),
("good", "lovely"),
("night, "day")
```
and given a separator *space*, then the result is a list with concatenated strings:

```
(
"Have a good day",
"Have a good night",
"Have a lovely day",
"Have a lovely night",
"I wish you a good day"
"I wish you a good night"
"I wish you a lovely day"
"I wish you a lovely night"
)
```

This is the function description; the mechanism is the same as the previous function:

```turtle
idlab-fn:crossConcatSequence
    dct:description "Produces the Cartesian product of an rdf:seq of objects or lists of objects, optionally with a separator" ;
    a                fno:Function ;
    rdfs:label       "crossConcatSequence" ;
    fno:expects      ( idlab-fn:_seq idlab-fn:_delimiter ) ;
    fno:name         "crossConcatSequence" ;
    fno:returns      ( idlab-fn:_listOut ) .
```

The first parameter, `idlab-fn:_seq`, is a special one in that sense
that it uses a predicate `rdf:_nnn` which means `rdf:_1` for the first
element of the sequence, `rdf_2` for the second etc.

```turtle
idlab-fn:_seq
    a             fno:Parameter ;
    fno:name      "rdf:Seq parameter" ;
    fno:predicate rdf:_nnn ;
    fno:type      xsd:any ;
    fno:required  "true"^^xsd:boolean .

```

```turtle
idlab-fn:_delimiter
    a             fno:Parameter ;
    fno:name      "delimiter" ;
    rdfs:label    "delimiter" ;
    fno:type      xsd:string ;
    fno:predicate idlab-fn:delimiter .
```

```turtle
idlab-fn:_listOut
    a             fno:Parameter ;
    fno:name      "output list" ;
    rdfs:label    "output list" ;
    fno:type      rdf:List ;
    fno:predicate idlab-fn:listOut .
```

### Solution

#### Mapping file in YARRRML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```yaml
prefixes:
 idlab-fn: https://w3id.org/imec/idlab/function#
 grel: http://users.ugent.be/~bjdmeest/function/grel.ttl#
 ex: http://example.org/

mappings:
  person:
    sources:
      - [classes.csv~csv]

    s: http://example.org/$(Student)
    po:
      - p: ex:takesClasses
        o:
          - function: idlab-fn:crossConcatSequence
            type: iri
            parameters:
              - [rdf:_1, http://example.org/class/]
              - parameter: rdf:_2
                value:
                  function: grel:string_split
                  parameters:
                    - [grel:valueParameter, $(Classes)]
                    - [grel:p_string_sep, ';']
```
#### Mapping file in RML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#> .
@prefix grel: <http://users.ugent.be/~bjdmeest/function/grel.ttl#> .
@prefix fno: <https://w3id.org/function/ontology#> .
@prefix idlab-fn: <https://w3id.org/imec/idlab/function#> .
@base <http://example.org/>.

<#LogicalSourceClasses> a rml:LogicalSource ;
  rml:source "classes.csv" ;
  rml:referenceFormulation ql:CSV .

<#ClassesMapping> a rr:TriplesMap;
  rml:logicalSource <#LogicalSourceClasses> ;

  rr:subjectMap [
    rr:template "http://example.org/{Student}";
  ] ;

  rr:predicateObjectMap [
    rr:predicate <takesClasses> ;
    rr:objectMap <#ListClassesFunction> ;
  ] .

<#ListClassesFunction>
    rr:termType rr:IRI;
    fnml:functionValue [
        rr:predicateObjectMap [
            rr:predicate fno:executes ;
            rr:objectMap [ rr:constant idlab-fn:crossConcatSequence ]
        ];
        rr:predicateObjectMap [
            rr:predicate rdf:_1 ;
            rr:objectMap [ rr:constant "http://example.org/class/" ]
        ];
        rr:predicateObjectMap [
            rr:predicate rdf:_2 ;
            rr:objectMap <#SplitClassesFunction>
        ];
    ] .


<#SplitClassesFunction>
    fnml:functionValue [
        rml:logicalSource <#LogicalSourceClasses>;
        rr:predicateObjectMap [
            rr:predicate fno:executes;
            rr:objectMap [ rr:constant grel:string_split ];
        ];
        rr:predicateObjectMap [
            rr:predicate grel:valueParameter;
            rr:objectMap [ rml:reference "Classes" ];
        ];
        rr:predicateObjectMap [
            rr:predicate grel:p_string_sep;
            rr:objectMap [ rr:constant ";" ];
        ];
    ].
```

#### Mapping engine output

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix ex: <http://example.org/> .

ex:Alice ex:takesClasses
  <http://example.org/class/Databases>, <http://example.org/class/Math>, <http://example.org/class/Programming> .

ex:Bob ex:takesClasses
  <http://example.org/class/French>, <http://example.org/class/German> .
```

{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>
