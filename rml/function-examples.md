---
layout: default
title: Function examples
---

<!-- Introduction -->
<section id="introduction">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h2>Introduction</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
{% renderTemplate "md" %}
Some general purpose functions are described in RDF at <https://users.ugent.be/~bjdmeest/function/grel.ttl> and <https://w3id.org/imec/idlab/function>.
Below we show how to discover some of them and use them in a mapping, written in [YARRRML](https://rml.io/yarrrml/) or [RML](https://rml.io/).
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
                <h2>To uppercase</h2>
            </div>
            <div class="col-lg-12">
{% renderTemplate "md" %}
### Problem

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

Predicate `fno:expects` provides info about the parameters to the function (more about these below).

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

#### Mapping in YARRRML

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

#### Mapping in RML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#>.
@prefix fno: <https://w3id.org/function/ontology#>.
@prefix d2rq: <http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#>.
@prefix void: <http://rdfs.org/ns/void#>.
@prefix dc: <http://purl.org/dc/terms/>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix : <http://mapping.example.com/>.
@prefix ex: <http://www.example.com/data/>.
@prefix grel: <http://users.ugent.be/~bjdmeest/function/grel.ttl#>.

:rules_000 a void:Dataset;
    void:exampleResource :map_vegetables_000.
:map_vegetables_000 rml:logicalSource :source_000.
:source_000 a rml:LogicalSource;
    rml:source "vegetables.csv";
    rml:referenceFormulation ql:CSV.
:map_vegetables_000 a rr:TriplesMap;
    rdfs:label "vegetables".
:s_000 a rr:SubjectMap.
:map_vegetables_000 rr:subjectMap :s_000.
:s_000 rr:template "http://www.example.com/data/{id}".
:pom_000 a rr:PredicateObjectMap.
:map_vegetables_000 rr:predicateObjectMap :pom_000.
:pm_000 a rr:PredicateMap.
:pom_000 rr:predicateMap :pm_000.
:pm_000 rr:constant rdfs:label.
:pom_000 rr:objectMap :om_000.
:om_000 a fnml:FunctionTermMap;
    rr:termType rr:Literal;
    fnml:functionValue :fn_000.
:fn_000 rml:logicalSource :source_000;
    rr:predicateObjectMap :pomexec_000.
:pomexec_000 rr:predicateMap :pmexec_000.
:pmexec_000 rr:constant fno:executes.
:pomexec_000 rr:objectMap :omexec_000.
:omexec_000 rr:constant "http://users.ugent.be/~bjdmeest/function/grel.ttl#toUpperCase";
    rr:termType rr:IRI.
:fn_000 rr:predicateObjectMap :pom_001.
:pom_001 a rr:PredicateObjectMap;
    rr:predicateMap :pm_001.
:pm_001 a rr:PredicateMap;
    rr:constant grel:valueParameter.
:pom_001 rr:objectMap :om_001.
:om_001 a rr:ObjectMap;
    rml:reference "label";
    rr:termType rr:Literal.
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
                <h2>Lookup</h2>
            </div>
            <div class="col-lg-12">
{% renderTemplate "md" %}
### Problem

Given a list of products, each annotated with a review code in the range 0 (lowest) to 3 (highest),
make a mapping to create triples `ex:id onto:buying-advice "<advicex>"`.
`<advicex>` Is one of the strings we define to represent a buying advice of a product.
The buying advice strings are based on the review code and are defined in a separate list.

The reviewed products are given in file `reviewed-products.csv`, with example content:

```csv
id,review code
1,3
2,2
3,1
4,0
```

The strings to represent a buying advice are given in file `buying-advices.csv`.
Column 0 has the review codes; column 1 has the buying advice strings.

```csv
0,avoid
1,consider
2,shortlist
3,buy
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

Predicate `fno:expects` provides info about the parameters to the function (more about these below).

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

#### Mapping in YARRRML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```yaml
prefixes:
  ex: http://www.example.com/data/
  onto: http://www.example.com/ontology/
  idlab-fn: https://w3id.org/imec/idlab/function#

mappings:
  buying-advices:
    sources:
      - ['reviewed-products.csv~csv']
    s:
      value: ex:$(id)
    po:
      - p: onto:buying-advice
        o:
          function: idlab-fn:lookup
          parameters:
            - [idlab-fn:str, $(review code)]
            - [idlab-fn:inputFile, 'buying-advices.csv']
            - [idlab-fn:fromColumn, 0]
            - [idlab-fn:toColumn, 1]
```

#### Mapping in RML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#>.
@prefix fno: <https://w3id.org/function/ontology#>.
@prefix d2rq: <http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#>.
@prefix void: <http://rdfs.org/ns/void#>.
@prefix dc: <http://purl.org/dc/terms/>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix : <http://mapping.example.com/>.
@prefix ex: <http://www.example.com/data/>.
@prefix onto: <http://www.example.com/ontology/>.
@prefix idlab-fn: <https://w3id.org/imec/idlab/function#>.

:rules_000 a void:Dataset;
    void:exampleResource :map_buying-advices_000.
:map_buying-advices_000 rml:logicalSource :source_000.
:source_000 a rml:LogicalSource;
    rml:source "reviewed-products.csv";
    rml:referenceFormulation ql:CSV.
:map_buying-advices_000 a rr:TriplesMap;
    rdfs:label "buying-advices".
:s_000 a rr:SubjectMap.
:map_buying-advices_000 rr:subjectMap :s_000.
:s_000 rr:template "http://www.example.com/data/{id}".
:pom_000 a rr:PredicateObjectMap.
:map_buying-advices_000 rr:predicateObjectMap :pom_000.
:pm_000 a rr:PredicateMap.
:pom_000 rr:predicateMap :pm_000.
:pm_000 rr:constant onto:buying-advice.
:pom_000 rr:objectMap :om_000.
:om_000 a fnml:FunctionTermMap;
    rr:termType rr:Literal;
    fnml:functionValue :fn_000.
:fn_000 rml:logicalSource :source_000;
    rr:predicateObjectMap :pomexec_000.
:pomexec_000 rr:predicateMap :pmexec_000.
:pmexec_000 rr:constant fno:executes.
:pomexec_000 rr:objectMap :omexec_000.
:omexec_000 rr:constant "https://w3id.org/imec/idlab/function#lookup";
    rr:termType rr:IRI.
:fn_000 rr:predicateObjectMap :pom_001.
:pom_001 a rr:PredicateObjectMap;
    rr:predicateMap :pm_001.
:pm_001 a rr:PredicateMap;
    rr:constant idlab-fn:str.
:pom_001 rr:objectMap :om_001.
:om_001 a rr:ObjectMap;
    rml:reference "review code";
    rr:termType rr:Literal.
:fn_000 rr:predicateObjectMap :pom_002.
:pom_002 a rr:PredicateObjectMap;
    rr:predicateMap :pm_002.
:pm_002 a rr:PredicateMap;
    rr:constant idlab-fn:inputFile.
:pom_002 rr:objectMap :om_002.
:om_002 a rr:ObjectMap;
    rr:constant "buying-advices.csv";
    rr:termType rr:Literal.
:fn_000 rr:predicateObjectMap :pom_003.
:pom_003 a rr:PredicateObjectMap;
    rr:predicateMap :pm_003.
:pm_003 a rr:PredicateMap;
    rr:constant idlab-fn:fromColumn.
:pom_003 rr:objectMap :om_003.
:om_003 a rr:ObjectMap;
    rr:constant "0";
    rr:termType rr:Literal.
:fn_000 rr:predicateObjectMap :pom_004.
:pom_004 a rr:PredicateObjectMap;
    rr:predicateMap :pm_004.
:pm_004 a rr:PredicateMap;
    rr:constant idlab-fn:toColumn.
:pom_004 rr:objectMap :om_004.
:om_004 a rr:ObjectMap;
    rr:constant "1";
    rr:termType rr:Literal.
```

#### Mapping engine output

```turtle
<http://www.example.com/data/1> <http://www.example.com/ontology/buying-advice> "buy" .
<http://www.example.com/data/2> <http://www.example.com/ontology/buying-advice> "shortlist" .
<http://www.example.com/data/3> <http://www.example.com/ontology/buying-advice> "consider" .
<http://www.example.com/data/4> <http://www.example.com/ontology/buying-advice> "avoid" .
```

{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>
