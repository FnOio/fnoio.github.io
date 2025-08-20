---
layout: default
title: Integration of function executions within RML
nav: |
    <li class="page-scroll">
        <a href="#about">About</a>
    </li>
    <li class="page-scroll">
        <a href="#example">Example</a>
    </li>
---

<!-- Header -->
<header>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <!--<img class="img-responsive" src="img/profile.png" alt="">-->
                <div class="intro-text">
                    <span class="name">Integration of function executions within RML</span>
                    <hr class="star-light">
                    <span class="skills">Paper accepted at <a href="https://2017.eswc-conferences.org/" target="_blank">ESWC 2017</a></span>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- About Section -->
<section id="about">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2>About</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>
                    Mapping languages allow us to define how Linked Data is generated from raw data,
                    but only if the raw data values can be used as is to form the desired Linked Data.
                    Since complex data transformations remain out of scope for mapping languages,
                    these steps are often implemented as custom solutions,
                    or with systems separate from the mapping process.
                    The former data transformations remain case-specific, often coupled with the mapping,
                    whereas the latter are not reusable across systems.
                </p>
                <p>
                    Hence, we propose an approach where data transformations
                </p>
                <ol>
                    <li>are defined declaratively and</li>
                    <li>are aligned with the mapping languages.</li>
                </ol>
                <p>
                    We employ an alignment of data transformations described
                    using the <a href="https://fno.io">Function Ontology</a> (FnO)
                    and mapping of data to Linked Data described
                    using the <a href="http://rml.io">RDF Mapping Language</a> (RML).
                    Our approach is not case-specific:
                    data transformations are independent of their implementation and thus interoperable,
                    while the functions are decoupled and reusable.
                    This allows developers to improve the generation framework,
                    whilst contributors can focus on the actual Linked Data,
                    as there are no more dependencies,
                    neither between the transformations and the generation framework nor their implementations.
                </p>
                <p>
                    This approach has been <a href="https://ruben.verborgh.org/publications/maroy_iswc_2017/">used</a>
                    to map and transform <a href="http://dbpedia.org">DBpedia</a>
                    in a declaratively defined and aligned way.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Example Section -->
<section id="example">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2>Example</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                {% renderTemplate "md" %}
                    We generate Linked Data using an RML document, that generates `ex:Person`-resources.
                {% endrenderTemplate %}
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
<#Person_Mapping>
    rml:logicalSource <#LogicalSource> ;      # Specify the data source
    rr:subjectMap <#SubjectMap> ;             # Specify the subject
    rr:predicateObjectMap <#NameMapping> .    # Specify the predicate-object-map

<#NameMapping>
    rr:predicate dbo:title ;                  # Specify the predicate
    rr:objectMap [
        rr:reference "name"                   # Specify the reference within the data source
    ] .
```
{% endrenderTemplate %}
            </div>
        </div>
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>
                    However, the original data values are not yet conform to the requested Linked Data format,
                    namely, the names are not correctly cased.
                    Thus, we employ a function within the RML document.
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <p>
                    The FnO description of the function <a
                        href="https://github.com/OpenRefine/OpenRefine/wiki/GREL-String-Functions#touppercasestring-s">toUpperCase</a>
                    is as follows:
                </p>
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
grel:toUpperCase a fno:Function ;
    fno:name "upper case" ;
    dcterms:description "return the input string in upper case" ;
    fno:expects ( [ fno:predicate grel:stringInput ] ) ;
    fno:output ( [ fno:predicate grel:stringOutput ] ) .
```
{% endrenderTemplate %}
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <p>
                    The execution of such function would be described as follows:
                </p>
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
:exe a fno:Execution ;
    fno:executes grel:toUpperCase ;
    grel:stringInput "This is an input STRING." ;
    grel:stringOutput "THIS IS AN INPUT STRING." .
```
{% endrenderTemplate %}
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>To connect this function with the RML mapping document, we make use of a
                    <code>fnml:FunctionMap</code>:
                </p>

                <blockquote>
                    <p>
                        The <code>fnml</code> namespace is hosted at
                        <a href="http://semweb.mmlab.be/ns/fnml#" target="_blank">http://semweb.mmlab.be/ns/fnml#</a>
                    </p>
                </blockquote>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
{% renderTemplate "md" %}
```turtle
<#Person_Mapping>
    rml:logicalSource <#LogicalSource> ;                  # Specify the data source
    rr:subjectMap <#SubjectMap> ;                         # Specify the subject
    rr:predicateObjectMap <#NameMapping> .                # Specify the predicate-object-map

<#NameMapping>
    rr:predicate dbo:title ;                              # Specify the predicate
    rr:objectMap <#FunctionMap> .                         # Specify the object-map

<#FunctionMap>
    fnml:functionValue [                                  # The object is the result of the function
        rml:logicalSource <#LogicalSource> ;              # Use the same data source for input
        rr:predicateObjectMap [
            rr:predicate fno:executes ;                   # Execute the function&hellip;
            rr:objectMap [ rr:constant grel:toUpperCase ] # grel:toUpperCase
        ] ;
        rr:predicateObjectMap [
            rr:predicate grel:inputString ;
            rr:objectMap [ rr:reference "name" ]          # Use as input the "name" reference
        ]
    ] .
```
{% endrenderTemplate %}
            </div>
        </div>
        
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>
                    Before the <code>name</code>-value is referenced,
                    the value is first used as <code>grel:inputString</code>-parameter
                    for the <code>grel:toUpperCase</code>-function.
                    The output of that function is then used as object
                    within the <code>&lt;#NameMapping&gt;</code>
                </p>
            </div>
        </div>

        <div class="row" id="example-dbpedia">
            <div class="col-lg-8 col-lg-offset-2">
                <p>
                    A full example of a DBpedia mapping file can be found below.
                </p>

{% renderTemplate "md" %}
```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.

<#WikiSource> rml:source "http://en.wikipedia.org/wiki/Mapping_en:Infobox_country?oldid=35237";
    rml:referenceFormulation <http://semweb.mmlab.be/ns/ql#wikitext>;
    rml:iterator "Infobox" .

<http://en.dbpedia.org/resource/Mapping_en:Infobox_country> rml:logicalSource <#WikiSource>;
  rr:subjectMap [ rr:constant "http://en.dbpedia.org/resource/{{wikititle}}" ];
  rr:predicateObjectMap [
    rr:predicate <http://dbpedia.org/ontology/demonym>;
    rr:objectMap [
      <http://semweb.mmlab.be/ns/fnml#functionValue> [
        rr:subjectMap [];
        rr:predicateObjectMap [
          rr:predicate <http://dbpedia.org/function/propertyParameter>;
          rr:objectMap [ rml:reference "demonym" ]
        ], [
          rr:predicate <http://dbpedia.org/function/dataTypeParameter>;
          rr:objectMap [ rr:constant "rdf:langString" ]
        ], [
          rr:predicate <http://w3id.org/function/ontology#executes>;
          rr:objectMap [ rr:constant <http://dbpedia.org/function/simplePropertyFunction> ]
        ];
        rml:logicalSource <#WikiSource>
      ]
    ]
  ]
] .
```
{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>

<!-- More function examples Section -->
<section id="more-function-examples">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2>More function examples</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 text-center">
                <p>
                    Click <a href="./function-examples">here</a> for more function examples.
                </p>
            </div>
        </div>
    </div>
</section>
